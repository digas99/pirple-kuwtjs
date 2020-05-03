class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

export default class Queue {
    constructor() {
        this.head = null;
        this.tail = null;
        this.values = [];
    }

    isEmpty() {
        return !this.head;
    }

    setValues() {
        let tmpArr = [];
        let tmp = this.head;

        // while there is a tmp
        while (tmp) {
            tmpArr.push(tmp.value);

            tmp = tmp.next;
        }

        this.values = tmpArr;

        if (this.isEmpty()) {
            console.log("QUEUE IS EMPTY");
        }
        else {
            console.log(this.values.join(','));
        }
    }
    
    enqueue(value) {
        let node = new Node(value);

        if (this.isEmpty()) {
            // both head and tail point to the new node because the queue was empty
            this.head = this.tail = node;
        }
        else {
            // the current last value will have its next to be the new value
            this.tail.next = node;

            // the new value will take now the last position
            this.tail = node;
        }

        this.setValues();
    }

    dequeue() {
        // value to be removed is the first on the queue
        let node = this.head;

        if (!this.isEmpty()) { 
            // head is now the next node from what was previously the head node
            this.head = node.next;

            // if head is null
            if(!this.head) {
                this.tail = null;
            }
        }

        this.setValues();

        return node;
    }

    peek() {
        if (!this.isEmpty()) {
            return this.head.value;
        }
        else {
            return null; 
        }
    }

    size() {
        if (this.isEmpty()) {
            return 0;
        }
        else {
            return this.values.length;
        }
    }
}