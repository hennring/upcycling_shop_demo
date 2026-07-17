package de.henningkloss.portfolio.auth;

import de.henningkloss.portfolio.common.ConflictException;

public class EmailAlreadyUsedException extends ConflictException {

    public EmailAlreadyUsedException() {
        super("E-mail address is already registered");
    }
}
