import Dish from "./cards/Dish";

export default function Dishes({
  dishes,
  selection,
  onDelete,
  onEdit,
  onSelect,
  view
}) {
  return (
    <>
      {dishes &&
        dishes.map((dish) => (
          <Dish
            id={dish.id}
            key={dish.id}
            name={dish.name}
            description={dish.description}
            picture={dish.picture}
            rating={dish.rating}
            view={view}
            addedBy={dish.user}
            selection={selection}
            onSelect={(selected) => onSelect(dish, selected)}
            onDelete={(e) => onDelete(dish)}
            onEdit={(e) => onEdit(dish)}
          ></Dish>
        ))}
    </>
  );
}
