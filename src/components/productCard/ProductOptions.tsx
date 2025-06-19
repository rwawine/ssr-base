"use client";
import * as React from "react";
import Dropdown from "../UI/Dropdown";
import { Dimension } from "@/types/product";

interface ProductOptionsProps {
    dimensions?: Dimension[];
    sizeLabel?: string;
}

export default function ProductOptions({
    dimensions = [],
    sizeLabel = "Выбрать размер",
}: ProductOptionsProps) {
    const [selectedSize, setSelectedSize] = React.useState<string | undefined>(undefined);
    const [mechanismChecked, setMechanismChecked] = React.useState(false);

    // Формируем опции для Dropdown размеров с ценой
    const sizeOptions = dimensions.map((dim) => ({
        value: `${dim.width}x${dim.length}`,
        label: `${dim.width}x${dim.length} — ${dim.price} BYN`,
    }));

    // Найти выбранный размер
    const selectedDimension = dimensions.find(
        (dim) => `${dim.width}x${dim.length}` === selectedSize
    );

    // Проверяем, есть ли подъемный механизм у выбранного размера
    const mechanismOption = selectedDimension?.additionalOptions?.find(
        (opt) => opt.name.toLowerCase().includes("подъемный механизм")
    );

    // Проверяем, есть ли вообще механизм хотя бы у одного размера
    const hasAnyMechanism = dimensions.some(
        (dim) =>
            dim.additionalOptions?.some((opt) =>
                opt.name.toLowerCase().includes("подъемный механизм")
            )
    );

    // Сброс механизма при смене размера
    React.useEffect(() => {
        setMechanismChecked(false);
    }, [selectedSize]);

    return (
        <div>
            <Dropdown
                label={sizeLabel}
                options={sizeOptions}
                value={selectedSize}
                onSelect={setSelectedSize}
            />
            {hasAnyMechanism && (
                <label style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0" }}>
                    <input
                        type="checkbox"
                        checked={mechanismChecked}
                        onChange={() => setMechanismChecked((v) => !v)}
                        disabled={!mechanismOption}
                    />
                    Подъемный механизм
                    {mechanismOption && (
                        <span style={{ color: "#888" }}>
                            {` (+${mechanismOption.price} BYN)`}
                        </span>
                    )}
                </label>
            )}
        </div>
    );
}
