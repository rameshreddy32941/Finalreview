'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, BookOpen, Video, FileText, HelpCircle, Bookmark, BookmarkCheck,
  Loader2, AlertCircle, Clock, Tag, Play, ExternalLink, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase, isSupabaseTableMissingError } from '@/lib/supabase';
import { LibraryItem, libraryItems } from '@/lib/library-data';
import { senseOrgans } from '@/lib/sense-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  article: BookOpen,
  video: Video,
  infographic: FileText,
  faq: HelpCircle,
};

const organColors: Record<string, string> = {
  eye: 'text-primary', ear: 'text-chart-2', nose: 'text-chart-3',
  tongue: 'text-chart-5', skin: 'text-chart-4', all: 'text-primary',
};

function normalizeLibraryItem(item: any): LibraryItem {
  const videoUrl = item.video_url ?? item.videoUrl ?? item.url ?? undefined;
  const imageUrl = item.image_url ?? item.imageUrl ?? item.url ?? undefined;
  const readTime = item.read_time ?? item.readTime ?? undefined;
  return {
    ...item,
    videoId: item.video_id ?? item.videoId,
    videoUrl,
    imageUrl,
    readTime,
  } as LibraryItem;
}

function getVideoSource(item: LibraryItem) {
  const source = item.videoUrl ?? item.url ?? '';
  const explicitId = item.videoId;
  const resolvedUrl = source?.trim();

  if (explicitId) {
    return { kind: 'youtube', src: `https://www.youtube.com/embed/${explicitId}` };
  }

  if (!resolvedUrl) {
    return null;
  }

  try {
    const parsed = new URL(resolvedUrl);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;
    const parts = pathname.split('/').filter(Boolean);

    if (hostname.includes('youtu.be')) {
      const id = parts[0];
      if (id) {
        return { kind: 'youtube', src: `https://www.youtube.com/embed/${id}` };
      }
    }

    if (hostname.includes('youtube.com')) {
      const searchId = parsed.searchParams.get('v');
      if (searchId) {
        return { kind: 'youtube', src: `https://www.youtube.com/embed/${searchId}` };
      }
      const embedIndex = parts.indexOf('embed');
      const embedId = embedIndex >= 0 ? parts[embedIndex + 1] : parts[parts.length - 1];
      if (embedId) {
        return { kind: 'youtube', src: `https://www.youtube.com/embed/${embedId}` };
      }
    }

    if (hostname.includes('vimeo.com')) {
      const id = parts[parts.length - 1];
      if (id) {
        return { kind: 'vimeo', src: `https://player.vimeo.com/video/${id}` };
      }
    }

    const extension = pathname.split('.').pop()?.toLowerCase();
    if (extension === 'mp4' || extension === 'webm' || extension === 'mov') {
      return { kind: 'mp4', src: resolvedUrl };
    }
  } catch {
    // ignore invalid URL
  }

  return null;
}

export default function LibraryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const itemId = params.id as string;
  const [item, setItem] = useState<LibraryItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<LibraryItem[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState(true);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);

  useEffect(() => {
    if (!itemId) return;

    const loadItem = async () => {
      setLoadingItem(true);
      const { data, error } = await supabase
        .from('library_items')
        .select('id,type,title,description,organ,category,url,video_id,read_time')
        .eq('id', itemId)
        .maybeSingle();

      if (error && isSupabaseTableMissingError(error)) {
        const fallbackItem = libraryItems.find((item) => item.id === itemId) ?? null;
        setItem(fallbackItem);
        setRelatedItems(
          libraryItems.filter((item) => item.organ === fallbackItem?.organ && item.id !== itemId).slice(0, 3)
        );
        setLoadingItem(false);
        return;
      }

      if (error) {
        console.error('Library item load error:', error);
      }

      if (data) {
        const itemData = normalizeLibraryItem(data);
        setItem(itemData);

        const { data: relatedData, error: relatedError } = await supabase
          .from('library_items')
          .select('id,type,title,description,organ,category,url,video_id,read_time')
          .eq('organ', data.organ)
          .neq('id', itemId)
          .limit(3);

        if (relatedError && !isSupabaseTableMissingError(relatedError)) {
          console.error('Library related items load error:', relatedError);
        }

        if (relatedError && isSupabaseTableMissingError(relatedError)) {
          setRelatedItems(libraryItems.filter((item) => item.organ === data.organ && item.id !== itemId).slice(0, 3));
        } else if (relatedData) {
          setRelatedItems((relatedData as any).map((item: any) => normalizeLibraryItem(item)));
        }
      } else {
        const fallbackItem = libraryItems.find((item) => item.id === itemId) ?? null;
        setItem(fallbackItem);
        setRelatedItems(
          libraryItems.filter((item) => item.organ === fallbackItem?.organ && item.id !== itemId).slice(0, 3)
        );
      }
      setLoadingItem(false);
    };

    loadItem();
  }, [itemId]);

  useEffect(() => {
    if (!user || !itemId) {
      setLoadingBookmarks(false);
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .maybeSingle();
      setBookmarked(!!data);
      setLoadingBookmarks(false);
    })();
  }, [user, itemId]);

  const toggleBookmark = async () => {
    if (!user || !item) return;
    setBookmarkLoading(true);
    if (bookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('item_id', itemId);
      setBookmarked(false);
      toast({ title: 'Bookmark removed', description: `"${item.title}" removed.` });
    } else {
      await supabase.from('bookmarks').insert({
        user_id: user.id,
        item_type: item.type,
        item_id: item.id,
        title: item.title,
        url: item.url || null,
      });
      setBookmarked(true);
      toast({ title: 'Bookmarked', description: `"${item.title}" saved.` });
    }
    setBookmarkLoading(false);
  };

  if (loadingItem) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/library')} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Library
        </Button>
        <Card className="glass p-12 text-center">
          <Loader2 className="mx-auto mb-3 h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading library item...</p>
        </Card>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/library')} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Library
        </Button>
        <Card className="glass p-12 text-center">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">This item could not be found.</p>
          <Link href="/dashboard/library">
            <Button variant="outline" className="mt-4">Browse Library</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const Icon = typeIcons[item.type] || BookOpen;
  const organ = senseOrgans.find((o) => o.id === item.organ);
  const related = relatedItems;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/library" className="hover:text-foreground transition-colors">Library</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="capitalize">{item.type}</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground truncate">{item.title}</span>
      </div>

      {/* Main content card */}
      <Card className="glass p-8 animate-fade-in-up">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-1.5 capitalize">{item.type}</Badge>
              <h1 className="text-2xl font-bold tracking-tight">{item.title}</h1>
            </div>
          </div>
          <button
            onClick={toggleBookmark}
            disabled={bookmarkLoading || loadingBookmarks}
            className="rounded-xl border border-border/50 p-3 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary disabled:opacity-50"
            title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            {bookmarkLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : bookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-primary" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5" />
            <span className={`font-medium ${organColors[item.organ]}`}>{organ?.name || 'General'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5" />
            {item.category}
          </div>
          {item.readTime && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {item.readTime} read
            </div>
          )}
        </div>

        {/* Video embed */}
        {item.type === 'video' && (() => {
          const source = getVideoSource(item);
          if (!source) return null;

          if (source.kind === 'mp4') {
            return (
              <div className="mb-6 overflow-hidden rounded-2xl bg-black shadow-lg">
                <video controls className="h-full w-full max-h-[520px] bg-black">
                  <source src={source.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          }

          return (
            <div className="mb-6 aspect-video overflow-hidden rounded-2xl bg-black shadow-lg">
              <iframe
                src={source.src}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          );
        })()}

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed text-base">{item.description}</p>

        {/* Article body */}
        {item.type === 'article' && (
          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-bold">Overview</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.content || `This article covers key aspects of ${organ?.name || 'sensory'} health, focusing on ${item.category.toLowerCase()}. Understanding these concepts helps you take proactive steps toward maintaining your sensory well-being.`}
            </p>
            <h2 className="text-lg font-bold mt-6">Key Takeaways</h2>
            <ul className="space-y-2">
              {[(item.category ? `Stay informed about ${item.category.toLowerCase()} and speak with a clinician if symptoms persist.` : 'Stay informed about routine care and seek advice if symptoms persist.'), 'Early detection of changes often leads to better outcomes.', 'Lifestyle and nutrition play an important role in long-term health.'].map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  {point}
                </li>
              ))}
            </ul>
            {item.source && (
              <div className="rounded-xl border border-border/50 bg-secondary/20 p-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Reference:</span> {item.source}
              </div>
            )}
          </div>
        )}

        {/* FAQ body */}
        {item.type === 'faq' && (
          <div className="mt-6 rounded-xl border border-border/50 bg-secondary/30 p-4">
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        )}

        {/* Infographic display */}
        {item.type === 'infographic' && (
          <div className="mt-6 rounded-2xl border border-border/50 bg-secondary/30 overflow-hidden">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} className="w-full object-cover" />
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-2xl bg-secondary/30 p-8 text-center">
                <div>
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-40" />
                  <p className="mt-2 text-sm text-muted-foreground">Visual infographic content</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* External link */}
        {item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" /> View Source
            </Button>
          </a>
        )}
      </Card>

      {/* Related items */}
      {related.length > 0 && (
        <div className="animate-fade-in-up stagger-2">
          <h2 className="text-lg font-bold mb-4">Related {organ?.name || 'Sensory'} Resources</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((rel) => {
              const RelIcon = typeIcons[rel.type] || BookOpen;
              return (
                <Link key={rel.id} href={`/dashboard/library/${rel.id}`}>
                  <Card className="sense-card group p-4 cursor-pointer">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2 transition-transform group-hover:scale-110">
                      <RelIcon className="h-4 w-4" />
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">{rel.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{rel.description}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Back button */}
      <Link href="/dashboard/library">
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Library
        </Button>
      </Link>
    </div>
  );
}
