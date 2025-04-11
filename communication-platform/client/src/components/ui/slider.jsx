import { cn } from "@/lib/utils";
import * as SliderPrimitive from "@radix-ui/react-slider";

function Slider({ className, value, onChange, min = 1, max = 6, step = 1, ...props }) {
    return (
        <SliderPrimitive.Root
            className={cn(
                "relative flex touch-none select-none items-center w-full",
                className
            )}
            value={[value]}
            onValueChange={(val) => onChange(val[0])}
            min={min}
            max={max}
            step={step}
            {...props}
        >
            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
                <SliderPrimitive.Range className="absolute h-full bg-primary" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb
                className="block h-5 w-5 rounded-full bg-primary shadow-md transition-transform focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Slider"
            />
        </SliderPrimitive.Root>
    );
}

export { Slider };
