import React, { useState, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ItemList from './components/ItemList.tsx';
import { SelectedItemsProvider } from './components/SelectedItemsContext.tsx';
import axios from 'axios';

interface Item {
  id: number;
  selected: boolean;
}

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);


  const loadItems = async (newPage: number, query = '') => {
    setLoading(true); 
    try {
      const response = await axios.get('http://localhost:3001/items', {
        params: { page: newPage, search: query },
      });
  
      const fetchedItems: Item[] = response.data.items.map((item: any) => ({
        id: item.id,
        selected: false,
      }));
  
      setItems((prevItems) => {
        const newItems = fetchedItems.filter(
          (newItem) => !prevItems.some((item) => item.id === newItem.id)
        );
        return [...prevItems, ...newItems];
      });
      setPage(newPage);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const updatedItems = [...items];
    const [draggedItem] = updatedItems.splice(dragIndex, 1);
    updatedItems.splice(hoverIndex, 0, draggedItem);
    setItems(updatedItems);
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const bottom = containerRef.current.scrollHeight === containerRef.current.scrollTop + containerRef.current.clientHeight;
      if (bottom && !loading) { 
        loadItems(page + 1);
      }
    }
  };

  useEffect(() => {
    loadItems(page, searchQuery);
  }, [page, searchQuery]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [page, loading]);

  useEffect(() => {
    loadItems(1);
  }, []);

  return ( 
    <SelectedItemsProvider>
      <DndProvider backend={HTML5Backend}>
        <div>
          <h1>Item List with Search, Select and Drag & Drop</h1>
          <div ref={containerRef} id="list-container" onScroll={handleScroll} style={{ height: '450px', 
              overflowY: 'scroll',
              border: '2px solid #000',
              margin: '10px',
              padding: '10px',
              boxSizing: 'border-box'}}>
            <ItemList items={items} moveItem={moveItem} />
            {loading && <div>Loading...</div>}
          </div>
        </div>
      </DndProvider>
    </SelectedItemsProvider>
  );
};

export default App;