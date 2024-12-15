import { useState, useRef } from "react";

const Tooltip = ({ children, content, position = "top" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef(null);

    const toggleTooltip = (visible) => {
        setIsVisible(visible);
    };

    return (
        <div className="relative">
            {/* Trigger element */}
            <div
                onMouseEnter={() => toggleTooltip(true)}
                onMouseLeave={() => toggleTooltip(false)}
                onFocus={() => toggleTooltip(true)}
                onBlur={() => toggleTooltip(false)}
            >
                {children}
            </div>

            {/* Tooltip */}
            {isVisible && (
                <div
                    ref={tooltipRef}
                    className={`absolute z-50 w-max max-w-xs px-3 py-2 text-sm text-white bg-gray-800 rounded shadow-lg transition-opacity duration-200 ${position === "top"
                        ? "bottom-full left-1/2 transform -translate-x-1/2 mb-2"
                        : position === "right"
                            ? "top-1/2 left-full transform -translate-y-1/2 ml-2"
                            : position === "bottom"
                                ? "top-full left-1/2 transform -translate-x-1/2 mt-2"
                                : "top-1/2 right-full transform -translate-y-1/2 mr-2"
                        }`}
                >
                    {content}
                    <span
                        className={`absolute ${position === "top"
                            ? "top-full left-1/2 transform -translate-x-1/2 border-t-gray-800"
                            : position === "right"
                                ? "right-full top-1/2 transform -translate-y-1/2 border-r-gray-800"
                                : position === "bottom"
                                    ? "bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800"
                                    : "left-full top-1/2 transform -translate-y-1/2 border-l-gray-800"
                            } w-0 h-0 border-[6px] border-transparent`}
                    />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
