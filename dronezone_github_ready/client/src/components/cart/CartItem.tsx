import { Trash2 } from "lucide-react";
import { useCart } from "./CartContext";
import QuantitySelector from "../ui/quantity-selector";
import { Link } from "wouter";
import { formatCurrency, convertUsdToKes } from "@/lib/currency";

interface CartItemProps {
  item: {
    id: number;
    productId: number;
    quantity: number;
    product: any;
  };
  inPage?: boolean;
}

const CartItem = ({ item, inPage = false }: CartItemProps) => {
  const { removeFromCart, updateQuantity } = useCart();

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  // Calculate item total
  const itemTotal = Number(item.product.price) * item.quantity;
  const itemTotalKes = convertUsdToKes(itemTotal);

  if (inPage) {
    return (
      <div className="flex border-b py-6">
        <div className="w-24 h-24 flex-shrink-0">
          <Link href={`/products/${item.product.slug}`}>
            <img 
              src={item.product.imageUrl} 
              alt={item.product.name} 
              className="w-full h-full object-cover rounded"
            />
          </Link>
        </div>
        <div className="ml-6 flex-1">
          <div className="flex justify-between mb-2">
            <Link href={`/products/${item.product.slug}`} className="font-semibold text-lg hover:text-blue-600">
              {item.product.name}
            </Link>
            <span className="text-error font-bold">{formatCurrency(itemTotalKes)}</span>
          </div>
          <p className="text-sm text-gray-600 mb-4 line-clamp-1">{item.product.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <QuantitySelector 
                quantity={item.quantity}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
              />
              <button 
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700 flex items-center"
              >
                <Trash2 size={16} className="mr-1" />
                <span>Remove</span>
              </button>
            </div>
            <span className="text-sm text-gray-500">
              {formatCurrency(convertUsdToKes(item.product.price))} each
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex border-b py-4">
      <Link href={`/products/${item.product.slug}`} className="w-20 h-20 flex-shrink-0">
        <img 
          src={item.product.imageUrl} 
          alt={item.product.name} 
          className="w-full h-full object-cover rounded"
        />
      </Link>
      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <Link href={`/products/${item.product.slug}`} className="font-semibold hover:text-blue-600">
            {item.product.name}
          </Link>
          <span className="text-error font-bold">{formatCurrency(itemTotalKes)}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-1">{item.product.description}</p>
        <div className="flex justify-between items-center mt-2">
          <QuantitySelector 
            quantity={item.quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            compact={true}
          />
          <button 
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
