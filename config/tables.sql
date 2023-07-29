-- Create the "Orders" table
CREATE TABLE Orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL
);

-- Create the "OrderItems" table
CREATE TABLE OrderItems (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES Orders(id) ON DELETE CASCADE,
    product_name VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL
);

-- Create the "Inventory" table
CREATE TABLE Inventory (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) UNIQUE NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL
);

-- Add Indexes
CREATE INDEX idx_orders_order_date ON Orders(order_date);
CREATE INDEX idx_order_items_order_id ON OrderItems(order_id);
CREATE INDEX idx_inventory_product_name ON Inventory(product_name);

-- Add Constraints
ALTER TABLE Orders ADD CONSTRAINT chk_order_total_amount CHECK (total_amount >= 0);
ALTER TABLE OrderItems ADD CONSTRAINT chk_order_item_quantity CHECK (quantity > 0);
ALTER TABLE OrderItems ADD CONSTRAINT chk_order_item_price CHECK (price >= 0);
ALTER TABLE Inventory ADD CONSTRAINT chk_inventory_quantity CHECK (quantity >= 0);
ALTER TABLE Inventory ADD CONSTRAINT chk_inventory_price CHECK (price >= 0);
