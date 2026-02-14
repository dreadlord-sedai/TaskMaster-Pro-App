package com.taskmaster.server;

import com.google.gson.*;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

///**
// * Gson Type Adapter to serialize/deserialize LocalDate.
// */
public class LocalDateAdapter implements JsonSerializer<LocalDate>, JsonDeserializer<LocalDate> {
    
    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
    
    @Override
    public JsonElement serialize(LocalDate date, Type typeOfSrc, JsonSerializationContext context) {
        return new JsonPrimitive(date.format(formatter));
    }
    
    @Override
    public LocalDate deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
            throws JsonParseException {
        return LocalDate.parse(json.getAsString(), formatter);
    }
}
//```
//
//## Deliverable 3: React Native TodoList Screen
//
//### Project Structure
//```
//TaskTarget/
//├── src/
//│   ├── components/
//│   │   └── TaskItem.tsx
//│   ├── screens/
//│   │   ├── HomeScreen.tsx
//│   │   ├── TodoListScreen.tsx
//│   │   └── AddEditTaskScreen.tsx
//│   ├── services/
//│   │   └── api.ts
//│   ├── types/
//│   │   └── task.ts
//│   └── utils/
//│       └── storage.ts
//├── App.tsx
//└── package.json