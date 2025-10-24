import React from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import Input from './Input';

const DynamicInputList = ({
  items = [],
  onAdd,
  onRemove,
  onChange,
  placeholder = "Nhập nội dung...",
  addButtonText = "Thêm mục",
  maxItems = 20,
  minItems = 1,
  disabled = false,
  className = "",
  label = "",
  icon: Icon,
  required = false
}) => {
  const canAdd = items.length < maxItems;
  const canRemove = items.length > minItems;

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="text-gray-500 dark:text-gray-400 text-sm font-medium block">
          {Icon && <Icon className="w-5 h-5 inline mr-1" />}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="group flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-1">
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                {index + 1}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <Input
                type="text"
                value={item}
                onChange={(e) => onChange(index, e.target.value)}
                placeholder={`${placeholder} ${index + 1}`}
                disabled={disabled}
                className="border-0 bg-transparent focus:ring-0 focus:border-transparent p-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 w-full"
              />
            </div>
            
            {canRemove && (
              <button
                onClick={() => onRemove(index)}
                disabled={disabled}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 h-6 w-6 flex items-center justify-center transition-opacity duration-200 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                title="Xóa mục này"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {canAdd && (
        <Button
          variant="outline"
          onClick={onAdd}
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm border-dashed border-2 border-gray-300 dark:border-gray-600 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 rounded-xl font-medium"
        >
          <PlusIcon className="w-4 h-4" />
          {addButtonText}
        </Button>
      )}

      {items.length >= maxItems && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Đã đạt giới hạn tối đa {maxItems} mục
        </p>
      )}
    </div>
  );
};

export default DynamicInputList;