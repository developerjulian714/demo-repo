export const suggestCategory = (description: string): string => {
    const desc = description.toLowerCase();

    if (desc.includes('pizza') || desc.includes('restaurant') || desc.includes('food') || desc.includes('swiggy') || desc.includes('zomato')) {
        return 'Eating Out';
    }

    if (desc.includes('bill') || desc.includes('electricity') || desc.includes('water') || desc.includes('internet') || desc.includes('wifi')) {
        return 'Utilities';
    }

    if (desc.includes('bigbasket') || desc.includes('blinkit') || desc.includes('grocery') || desc.includes('milk') || desc.includes('vegetables')) {
        return 'Groceries';
    }

    if (desc.includes('uber') || desc.includes('ola') || desc.includes('petrol') || desc.includes('diesel') || desc.includes('fuel') || desc.includes('metro')) {
        return 'Transport';
    }

    if (desc.includes('movie') || desc.includes('netflix') || desc.includes('amazon prime') || desc.includes('game')) {
        return 'Entertainment';
    }

    return 'General';
};
