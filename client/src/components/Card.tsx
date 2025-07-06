import DeleteIcon from "../assets/icons/DeleteIcon";
import EditIcon from "../assets/icons/EditIcon";


const Card = (
  props: React.HTMLAttributes<HTMLAnchorElement> & {
    name?: string;
    email?: string;
    onDelete?: () => void;
    onEdit?: () => void;
  }
) => {
  return (
    <div className="block rounded-md bg-cardcolor p-4 shadow-sm sm:p-6 w-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-base">{props.name}</p>
          <p className="text-sm text-muted">{props.email}</p>
        </div>

        <div className="space-x-2">
          <button
            onClick={props.onEdit}
            className="text-foreground hover:underline text-sm"
          >
            <EditIcon />
          </button>
          <button
            onClick={props.onDelete}
            className="text-[#EF4444] hover:underline text-sm"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
