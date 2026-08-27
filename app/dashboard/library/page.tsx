'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, BookOpen, Video, FileText, HelpCircle, Bookmark, BookmarkCheck,
  Filter, Loader2, Inbox, AlertCircle, Sparkles, X, Play
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase, isSupabaseTableMissingError } from '@/lib/supabase';
import { LibraryItem, libraryItems } from '@/lib/library-data';
import { senseOrgans } from '@/lib/sense-data';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const categoryFilters = [
  { id: 'all', label: 'All' },
  { id: 'eye', label: 'Eye' },
  { id: 'ear', label: 'Ear' },
  { id: 'nose', label: 'Nose' },
  { id: 'tongue', label: 'Oral' },
  { id: 'skin', label: 'Skin' },
  { id: 'general', label: 'General' },
];

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  article: BookOpen,
  video: Video,
  infographic: FileText,
  faq: HelpCircle,
};

const typeLabels: Record<string, string> = {
  article: 'Articles',
  video: 'Videos',
  infographic: 'Infographics',
  faq: 'FAQs',
};

const organColors: Record<string, string> = {
  eye: 'text-primary', ear: 'text-chart-2', nose: 'text-chart-3',
  tongue: 'text-chart-5', skin: 'text-chart-4', all: 'text-primary',
};

const filterTypes = [
  { id: 'all', label: 'All', icon: Filter },
  { id: 'article', label: 'Articles', icon: BookOpen },
  { id: 'video', label: 'Videos', icon: Video },
  { id: 'infographic', label: 'Infographics', icon: FileText },
  { id: 'faq', label: 'FAQs', icon: HelpCircle },
];

export default function LibraryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState<Set<string>>(new Set());
  const [libraryItemsState, setLibraryItemsState] = useState<LibraryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [bookmarkLoadingState, setBookmarkLoadingState] = useState(true);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);

  const loadLibraryItems = useCallback(async () => {
    setLibraryLoading(true);
    setLibraryError(null);
    try {
      const { data, error } = await supabase
        .from('library_items')
        .select('id,type,title,description,organ,category,url,video_id,read_time');

      if (error) {
        console.error('Supabase library_items error:', error);
        if (isSupabaseTableMissingError(error)) {
          setLibraryItemsState(libraryItems);
          return;
        }
        setLibraryError('Unable to load library resources. Please try again later.');
        setLibraryItemsState([]);
        return;
      }

      if (data && data.length > 0) {
        setLibraryItemsState((data as any[]).map((item: any) => ({
          ...item,
          videoId: item.video_id ?? item.videoId,
          readTime: item.read_time ?? item.readTime,
        })) as LibraryItem[]);
      } else {
        setLibraryItemsState(libraryItems);
      }
    } finally {
      setLibraryLoading(false);
    }
  }, []);

  const loadBookmarks = useCallback(async () => {
    setBookmarkLoadingState(true);
    setBookmarkError(null);
    if (!user) {
      setBookmarks(new Set());
      setBookmarkLoadingState(false);
      return;
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .select('item_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Supabase bookmarks error:', error);
      if (isSupabaseTableMissingError(error)) {
        setBookmarks(new Set());
      } else {
        setBookmarkError('Failed to load bookmarks. Please try again.');
        toast({
          title: 'Unable to load bookmarks',
          description: 'Please refresh the page or try again later.',
          variant: 'destructive',
        });
        setBookmarks(new Set());
      }
    } else if (data) {
      setBookmarks(new Set((data as { item_id: string }[]).map((b) => b.item_id)));
    } else {
      setBookmarks(new Set());
    }
    setBookmarkLoadingState(false);
  }, [toast, user]);

  useEffect(() => {
    loadLibraryItems();
    loadBookmarks();
  }, [loadLibraryItems, loadBookmarks]);

  const toggleBookmark = async (item: LibraryItem) => {
    if (!user) return;
    setBookmarkLoading((prev) => new Set(prev).add(item.id));
    if (bookmarks.has(item.id)) {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', item.id);
      if (error) {
        if (isSupabaseTableMissingError(error)) {
          setBookmarks((prev) => {
            const next = new Set(prev);
            next.delete(item.id);
            return next;
          });
          toast({ title: 'Bookmark removed', description: `"${item.title}" removed from this session.` });
        } else {
          toast({ title: 'Error', description: 'Failed to remove bookmark.', variant: 'destructive' });
        }
      } else {
        setBookmarks((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
        toast({ title: 'Bookmark removed', description: `"${item.title}" removed from your bookmarks.` });
      }
    } else {
      const { error } = await supabase.from('bookmarks').insert({
        user_id: user.id,
        item_type: item.type,
        item_id: item.id,
        title: item.title,
        url: item.url || null,
      });
      if (error) {
        if (isSupabaseTableMissingError(error)) {
          setBookmarks((prev) => {
            const next = new Set(prev);
            next.add(item.id);
            return next;
          });
          toast({ title: 'Saved locally', description: `"${item.title}" is bookmarked for this session.` });
        } else {
          toast({ title: 'Error', description: 'Failed to save bookmark.', variant: 'destructive' });
        }
      } else {
        setBookmarks((prev) => {
          const next = new Set(prev);
          next.add(item.id);
          return next;
        });
        toast({ title: 'Bookmarked', description: `"${item.title}" saved to your bookmarks.` });
      }
    }
    setBookmarkLoading((prev) => {
      const next = new Set(prev);
      next.delete(item.id);
      return next;
    });
  };

  const filtered = libraryItemsState.filter((item) => {
    const q = search.toLowerCase().trim();
    const queryableText = [item.title, item.description, item.category, item.content || '']
      .join(' ')
      .toLowerCase();
    const matchesSearch = !q || queryableText.includes(q) || item.type.toLowerCase().includes(q);
    const organValue = item.organ?.toLowerCase?.() || '';
    const matchesCategory =
      activeCategory === 'all' ||
      (activeCategory === 'general'
        ? organValue === 'all'
        : activeCategory === 'tongue'
        ? organValue === 'tongue'
        : organValue === activeCategory);
    const matchesType = activeType === 'all' || item.type === activeType;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleCardClick = (item: LibraryItem) => {
    router.push(`/dashboard/library/${item.id}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Library</h1>
          <p className="mt-1 text-muted-foreground">Search articles, videos, infographics, and FAQs across all sense organs</p>
        </div>
        <Badge variant="secondary" className="w-fit gap-1">
          <Sparkles className="h-3 w-3" /> {libraryItemsState.length} resources
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, description, or category..."
          className="glass-input h-12 pl-11 pr-10 text-base"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {filterTypes.map((filter) => {
          const isActive = activeType === filter.id;
          const count = filter.id === 'all'
            ? libraryItemsState.length
            : libraryItemsState.filter((i) => i.type === filter.id).length;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveType(filter.id)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'border-primary bg-primary/10 text-primary shadow-sm'
                  : 'border-border/50 bg-card/40 text-muted-foreground hover:border-primary/30 hover:bg-secondary/50 hover:text-foreground'
              }`}
            >
              <filter.icon className="h-4 w-4" />
              {filter.label}
              <span className={`rounded-full px-1.5 py-0.5 text-xs ${isActive ? 'bg-primary/20' : 'bg-secondary'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {categoryFilters.map((filter) => {
          const isActive = activeCategory === filter.id;
          return (
            <button
              key={filter.id + filter.label}
              onClick={() => setActiveCategory(filter.id)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                isActive
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border/50 bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Error state */}
      {libraryError && (
        <Card className="glass p-6 border-destructive/30">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{libraryError}</p>
            <Button variant="outline" size="sm" onClick={loadLibraryItems} className="ml-auto">Retry</Button>
          </div>
        </Card>
      )}
      {bookmarkError && (
        <Card className="glass p-6 border-destructive/30">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{bookmarkError}</p>
            <Button variant="outline" size="sm" onClick={loadBookmarks} className="ml-auto">Retry</Button>
          </div>
        </Card>
      )}

      {/* Content */}
      {!libraryError && (
        <>
          {libraryLoading ? (
            <div className="flex h-[300px] items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">Loading library...</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <Card className="glass p-12 text-center">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Inbox className="h-12 w-12 opacity-40" />
                <p className="text-sm font-medium">No results found</p>
                <p className="text-xs">
                  {search
                    ? `No items match ${'"'}${search}${'"'}. Try a different search term.`
                    : 'No items in this category.'}
                </p>
                {search && (
                  <Button variant="outline" size="sm" onClick={() => setSearch('')} className="mt-2">
                    Clear search
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <>
              {/* Results count */}
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filtered.length}</span> {filtered.length === 1 ? 'result' : 'results'}
                {search && (
                  <> for &quot;<span className="font-medium text-foreground">{search}</span>&quot;</>
                )}
                {activeType !== 'all' && <> in {typeLabels[activeType]}</>}
              </p>

              {/* Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item, i) => {
                  const Icon = typeIcons[item.type] || BookOpen;
                  const organ = senseOrgans.find((o) => o.id === item.organ);
                  const isBookmarked = bookmarks.has(item.id);
                  const isBookmarkLoading = bookmarkLoading.has(item.id);
                  return (
                    <Card
                      key={item.id}
                      className="sense-card group p-5 cursor-pointer animate-fade-in-up"
                      style={{ animationDelay: `${Math.min(i * 30, 600)}ms` }}
                      onClick={() => handleCardClick(item)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                          <Icon className="h-5 w-5" />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(item);
                          }}
                          disabled={isBookmarkLoading}
                          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary disabled:opacity-50"
                          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                        >
                          {isBookmarkLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : isBookmarked ? (
                            <BookmarkCheck className="h-5 w-5 text-primary" />
                          ) : (
                            <Bookmark className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-xs capitalize">{item.type}</Badge>
                        <Badge variant="outline" className={`text-xs ${organColors[item.organ]}`}>
                          {organ?.name || 'General'}
                        </Badge>
                        {item.readTime && <span className="text-xs text-muted-foreground">{item.readTime}</span>}
                      </div>
                      {item.type === 'video' && item.videoId && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary">
                          <Play className="h-3 w-3" /> Watch video
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

    </div>
  );
}
