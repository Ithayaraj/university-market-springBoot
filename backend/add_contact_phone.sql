-- Add contact_phone column to product table
ALTER TABLE product 
ADD COLUMN contact_phone VARCHAR(20) AFTER location;

-- Verify the column was added
DESCRIBE product;
