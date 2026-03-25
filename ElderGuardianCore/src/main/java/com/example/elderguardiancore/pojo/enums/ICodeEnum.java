package com.example.elderguardiancore.pojo.enums;

import java.util.function.Function;

public interface ICodeEnum {
    int getId();

    String getName();

    static <T extends Enum<T>> T fromValue(Object input, Class<T> enumClass, Function<T, Integer> idExtractor) {
        int value = 0;
        if (input instanceof Number) {
            value = ((Number) input).intValue();
        } else if (input instanceof String) {
            try {
                value = Integer.parseInt((String) input);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("ID必须是数字或数字字符串");
            }
        }

        for (T enumValue : enumClass.getEnumConstants()) {
            if (idExtractor.apply(enumValue) == value) {
                return enumValue;
            }
        }
        throw new IllegalArgumentException("无效的ID: " + value);
    }

    static <E extends ICodeEnum> E getEnumFromId(Class<E> enumClass, int id) {
        for (E e : enumClass.getEnumConstants()) {
            if (e.getId() == id) {
                return e;
            }
        }
        throw new IllegalArgumentException("Invalid code: " + id + " for enum " + enumClass.getSimpleName());
    }
}
