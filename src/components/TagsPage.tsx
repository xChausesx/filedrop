import React, { useState, useEffect } from 'react';
import { Tag } from '../types';
import * as api from '../services/api';

const TagsPage: React.FC<{ onSearchByTag?: (tag: string) => void }> = ({ onSearchByTag }) => {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => { api.getTags().then(setTags); }, []);

  return (
    <div>
      <h2>🏷️ Tags</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {tags.map(tag => (
          <div key={tag.id} onClick={() => onSearchByTag?.(tag.name)}
            style={{
              background: '#fff', border: `2px solid ${tag.color}`, borderRadius: 10, padding: '10px 18px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'transform 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: tag.color, display: 'inline-block' }} />
            <span style={{ fontWeight: 600 }}>{tag.name}</span>
            <span style={{ background: '#eee', borderRadius: 10, padding: '1px 8px', fontSize: 12 }}>{tag.fileCount}</span>
          </div>
        ))}
        {tags.length === 0 && <p style={{ color: '#999' }}>No tags yet</p>}
      </div>
    </div>
  );
};

export default TagsPage;

