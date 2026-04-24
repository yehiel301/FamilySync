package com.familysync.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/welcome") // כל הבקשות לקונטרולר הזה יתחילו בנתיב זה
public class WelcomeController {

    @GetMapping // פונקציה זו תגיב לבקשות GET
    public String getWelcomeMessage() {
        return "Welcome to the FamilySync API!";
    }
}