import React, { createContext, useCallback, useContext, useState } from 'react';

type VoteState = 'up' | 'down' | null;

export interface PostState {
  id: string;
  upvotes: number;
  vote: VoteState;
  saved: boolean;
  commentCount: number;
}

const INITIAL_STATES: PostState[] = [
  { id: '1', upvotes: 15, vote: null, saved: false, commentCount: 3 },
  { id: '2', upvotes: 43, vote: null, saved: false, commentCount: 2 },
  { id: '3', upvotes: 2,  vote: null, saved: false, commentCount: 1 },
];

interface PostsContextType {
  postStates: PostState[];
  handleVote: (id: string, dir: 'up' | 'down') => void;
  handleSave: (id: string) => void;
  updateCommentCount: (id: string, count: number) => void;
}

const PostsContext = createContext<PostsContextType>({
  postStates: INITIAL_STATES,
  handleVote: () => {},
  handleSave: () => {},
  updateCommentCount: () => {},
});

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [postStates, setPostStates] = useState<PostState[]>(INITIAL_STATES);

  const handleVote = useCallback((id: string, dir: 'up' | 'down') => {
    setPostStates(prev => prev.map(p => {
      if (p.id !== id) return p;
      if (p.vote === dir) {
        return { ...p, vote: null, upvotes: dir === 'up' ? p.upvotes - 1 : p.upvotes + 1 };
      }
      if (p.vote !== null) return p;
      return { ...p, vote: dir, upvotes: dir === 'up' ? p.upvotes + 1 : Math.max(0, p.upvotes - 1) };
    }));
  }, []);

  const handleSave = useCallback((id: string) => {
    setPostStates(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
  }, []);

  const updateCommentCount = useCallback((id: string, count: number) => {
    setPostStates(prev => prev.map(p => p.id === id ? { ...p, commentCount: count } : p));
  }, []);

  return (
    <PostsContext.Provider value={{ postStates, handleVote, handleSave, updateCommentCount }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  return useContext(PostsContext);
}
