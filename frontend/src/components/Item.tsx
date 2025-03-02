import React from "react";
import { useDrag, useDrop } from "react-dnd";

interface ItemProps {
  item: number;
  isSelected: boolean;
  toggleSelect: (item: number) => void;
}

const Item: React.FC<ItemProps> = ({ item, isSelected, toggleSelect }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "ITEM",
    item: { id: item },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "ITEM",
    drop: (draggedItem: { id: number }) => {
      console.log(`Dropped item:${draggedItem.id}`);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
        ref={(node: HTMLDivElement | null) => {
            if (node) {
                drag(drop(node));
            }
        }}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isSelected ? "lightblue" : "white",
        border: isOver ? "2px solid green" : "1px solid gray",
        padding: "8px",
        margin: "4px",
        cursor: "move",
      }}
      onClick={() => toggleSelect(item)}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => toggleSelect(item)}
      />
      Item {item}
    </div>
  );
};

export default Item;