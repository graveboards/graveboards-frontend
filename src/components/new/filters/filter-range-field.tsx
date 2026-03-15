import React from 'react';
import {Switch} from "@/components/ui/switch";

const FilterRangeField = ({values, setValues, title, onRangeChange}: {
    values: number[],
    setValues: React.Dispatch<React.SetStateAction<number[]>>,
    title: string,
    onRangeChange?: (isRange: boolean) => void
}) => {
    const [isRange, setIsRange] = React.useState(false);

    React.useEffect(() => {
        setIsRange(values.length === 2);
    }, [values.length]);

    const handleRangeChange = (isRange: boolean) => {
        setIsRange(isRange);
        onRangeChange?.(isRange);
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="text-md font-semibold">
                {title}
            </div>
            {isRange ? (
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <div className="flex flex-col gap-1 grow">
                            <div className="text-sm">
                                Higher than
                            </div>
                            <input
                                className=
                                    "w-full sm:w-auto placeholder-tertiary-500 dark:placeholder-tertiary-400 whitespace-nowrap p-2 rounded-lg dark:bg-tertiary-900 outline-none border flex items-center justify-between gap-1 transition-colors duration-300 ease-in-out focus:border-primary-500 focus:bg-tertiary-100 focus:dark:bg-tertiary-800 border-tertiary-300 dark:border-tertiary-700"
                                type="text"
                                placeholder="Higher than"
                                value={values[0]}
                                onChange={(e) => setValues([Number(e.target.value), values[1]])}
                            />
                        </div>
                        <div className="flex flex-col gap-1 grow">
                            <div className="text-sm">
                                Lower than
                            </div>
                            <input
                                className=
                                    "w-full sm:w-auto placeholder-tertiary-500 dark:placeholder-tertiary-400 whitespace-nowrap p-2 rounded-lg dark:bg-tertiary-900 outline-none border flex items-center justify-between gap-1 transition-colors duration-300 ease-in-out focus:border-primary-500 focus:bg-tertiary-100 focus:dark:bg-tertiary-800 border-tertiary-300 dark:border-tertiary-700"
                                type="text"
                                placeholder="Lower than"
                                value={values[1]}
                                onChange={(e) => setValues([values[0], Number(e.target.value)])}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <input
                    className=
                        "w-full sm:w-auto placeholder-tertiary-500 dark:placeholder-tertiary-400 whitespace-nowrap p-2 rounded-lg dark:bg-tertiary-900 outline-none border flex items-center justify-between gap-1 transition-colors duration-300 ease-in-out focus:border-primary-500 focus:bg-tertiary-100 focus:dark:bg-tertiary-800 border-tertiary-300 dark:border-tertiary-700"
                    type="text"
                    placeholder={title}
                    value={values[0]}
                    onChange={(e) => setValues([Number(e.target.value)])}
                />
            )}
            <div className="flex gap-2 mt-1 ml-3">
                <Switch
                    checked={isRange}
                    onCheckedChange={handleRangeChange}
                />
                <div className="text-sm">
                    Filter within range
                </div>
            </div>
        </div>
    );
};

export default FilterRangeField;
