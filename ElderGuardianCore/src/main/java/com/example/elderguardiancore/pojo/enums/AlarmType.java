package com.example.elderguardiancore.pojo.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum AlarmType implements ICodeEnum {
    ROOM_ALARM(0, "房间警报"),
    HEALTH_ALARM(1, "健康警报");

    private final int id;
    private final String name;

    AlarmType(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    @JsonCreator
    public static AlarmType fromId(Object input) {
        return ICodeEnum.fromValue(input, AlarmType.class, AlarmType::getId);
    }
}