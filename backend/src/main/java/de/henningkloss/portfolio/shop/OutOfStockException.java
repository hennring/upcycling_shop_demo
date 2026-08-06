package de.henningkloss.portfolio.shop;

import de.henningkloss.portfolio.common.ConflictException;

/**
 * The product is "vergriffen": it is still in the catalogue, but the current batch is gone.
 * A conflict (409), not a 404 - the product exists, its stock does not.
 */
public class OutOfStockException extends ConflictException {

    public OutOfStockException(String productName) {
        super("Product is out of stock: " + productName);
    }
}
