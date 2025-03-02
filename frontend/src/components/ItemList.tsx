import React, { useEffect, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useSelectedItems } from './SelectedItemsContext.tsx';
import { useDrag, useDrop } from 'react-dnd';

interface Item {
  id: number;
  selected: boolean;
}

interface ItemListProps {
  items: Item[];
  moveItem: (dragIndex: number, hoverIndex: number) => void;
}

interface DraggableItemProps {
  item: Item;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  isSelected: boolean;
  toggleSelectItem: (item: number) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, index, moveItem, isSelected, toggleSelectItem }) => {
  const [, ref] = useDrag({
    type: 'ITEM',
    item: { index }, 
  });

  const [, drop] = useDrop({
    accept: 'ITEM',
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => { if (node) ref(drop(node)); }} key={item.id} className="item">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => toggleSelectItem(item.id)}
      />
      <span>{item.id}</span>
    </div>
  );
};

const ItemList: React.FC<ItemListProps> = ({ items, moveItem }) => {
  const { selectedItems, toggleSelectItem } = useSelectedItems();
  const [displayedItems, setDisplayedItems] = useState<Item[]>(items.slice(0, 20));
  const listRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = items.filter(item => item.id.toString().includes(searchQuery));

  useEffect(() => {
    const savedSelectedItems = JSON.parse(localStorage.getItem('selectedItems') || '[]');
    const savedSortedItems = JSON.parse(localStorage.getItem('sortedItems') || '[]');

    if (savedSelectedItems.length > 0) {
      savedSelectedItems.forEach((id: number) => {
        toggleSelectItem(id);
      });
    }

    if (savedSortedItems.length > 0) {
      setDisplayedItems(savedSortedItems);
    }
  }, []);

  // Хук для сохранения выбранных и отсортированных элементов в localStorage
  useEffect(() => {
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    localStorage.setItem('sortedItems', JSON.stringify(displayedItems));
  }, [selectedItems, displayedItems]);

  
  return (
    <div ref={listRef}>
      {/* Поле для поиска */}
      <input
        type="text"
        placeholder="Search by number..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px' }}
      />
      
      {loading && <div>Loading...</div>}
      <List
        height={450}
        itemCount={filteredItems.length}
        itemSize={50}
        width="100%"
      >
        {({ index, style }) => {
          const item = filteredItems[index];
          return (
            <div style={style} key={item.id}>
              <DraggableItem
                item={item}
                index={index}
                moveItem={moveItem}
                isSelected={selectedItems.includes(item.id)}
                toggleSelectItem={toggleSelectItem}
              />
            </div>
          );
        }}
      </List>
    </div>
  );
};

export default ItemList; 