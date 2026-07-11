package com.sofacompany.sofa_backend.security;

import org.springframework.stereotype.Component;
import java.security.SecureRandom;

@Component
public class CredentialGenerator {

    private static final String PASSWORD_CHARS =
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    private static final SecureRandom RANDOM = new SecureRandom();

    public String generateUsername(String fullName, java.util.function.Predicate<String> existsCheck) {
        String base = fullName.trim().toLowerCase().replaceAll("\\s+", ".");
        String candidate = base + "@sofacompany.local";
        int suffix = 2;

        while (existsCheck.test(candidate)) {
            candidate = base + suffix + "@sofacompany.local";
            suffix++;
        }
        return candidate;
    }

    public String generatePassword() {
        StringBuilder sb = new StringBuilder(12);
        for (int i = 0; i < 12; i++) {
            sb.append(PASSWORD_CHARS.charAt(RANDOM.nextInt(PASSWORD_CHARS.length())));
        }
        return sb.toString();
    }
}