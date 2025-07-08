import { useIsMobile } from "../../hooks/use-mobile";

const PlusIcon = () => {

  const isMobile = useIsMobile();

  return (
    <svg
      width={isMobile ? 20 : 24}
      height={isMobile ? 20 : 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 12H18"
        stroke="#22C55E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 18V6"
        stroke="#22C55E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PlusIcon;
