import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  compact?: boolean;
}

const QuantitySelector = ({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  compact = false
}: QuantitySelectorProps) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onDecrease();
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onIncrease();
    }
  };

  if (compact) {
    return (
      <div className="flex items-center border rounded">
        <button 
          className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          onClick={handleDecrease}
          disabled={quantity <= min}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="px-2 py-1">{quantity}</span>
        <button 
          className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          onClick={handleIncrease}
          disabled={quantity >= max}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        disabled={quantity <= min}
        className="h-8 w-8 rounded-full"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-10 text-center">{quantity}</span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrease}
        disabled={quantity >= max}
        className="h-8 w-8 rounded-full"
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default QuantitySelector;
