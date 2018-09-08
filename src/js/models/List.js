import uniqid from 'uniqid';

export default class List {

    constructor() {
        this.items = [];
    }

    // Add an item to the list
    addItem(count, unit, ingredient) {

        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }

        this.items.push(item);
        return item;

    }

    // Delete an item from the list
    deleteItem(id) {

        const index = this.items.findIndex(el => el.id === id);

        this.items.splice(index, 1);

    }

    // Update the new item count
    updateCount(id, newCount) {

        this.items.find(el => el.id === id).count = newCount;

    }

}