import { FaTshirt, FaMugHot, FaStickyNote, FaBox } from 'react-icons/fa';

interface ProductIconProps {
  category?: string;
  size?: number;
}

export default function ProductIcon({ category, size = 64 }: ProductIconProps) {
  const getIcon = () => {
    switch (category?.toLowerCase()) {
      case 'apparel':
      case 't-shirt':
      case 'hoodie':
        return <FaTshirt size={size} />;
      case 'mug':
        return <FaMugHot size={size} />;
      case 'sticker':
        return <FaStickyNote size={size} />;
      default:
        return <FaBox size={size} />;
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#cccccc' }}>
      {getIcon()}
    </div>
  );
}
