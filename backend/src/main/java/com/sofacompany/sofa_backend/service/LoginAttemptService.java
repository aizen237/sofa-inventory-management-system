package com.sofacompany.sofa_backend.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCKOUT_MINUTES = 15;

    private final ConcurrentHashMap<String, AttemptRecord> attempts = new ConcurrentHashMap<>();

    private static class AttemptRecord {
        int count;
        Instant lockedUntil;
    }

    public void recordFailure(String email) {
        AttemptRecord record = attempts.computeIfAbsent(email, k -> new AttemptRecord());
        record.count++;
        if (record.count >= MAX_ATTEMPTS) {
            record.lockedUntil = Instant.now().plusSeconds(LOCKOUT_MINUTES * 60);
        }
    }

    public void recordSuccess(String email) {
        attempts.remove(email);
    }

    public int getRemainingAttempts(String email) {
        AttemptRecord record = attempts.get(email);
        if (record == null) return MAX_ATTEMPTS;
        return Math.max(0, MAX_ATTEMPTS - record.count);
    }

    public boolean isLocked(String email) {
        AttemptRecord record = attempts.get(email);
        if (record == null || record.lockedUntil == null) {
            return false;
        }
        if (Instant.now().isAfter(record.lockedUntil)) {
            attempts.remove(email);
            return false;
        }
        return true;
    }
}