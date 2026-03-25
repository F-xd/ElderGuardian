package com.example.elderguardiancore.pojo.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum AlarmStatus implements ICodeEnum {
    UNPROCESSED(0, "未处理"),
    PROCESSED(1, "已处理");

    private final int id;
    private final String name;

    AlarmStatus(int id, String name) {
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
    public static AlarmStatus fromId(Object input) {
        return ICodeEnum.fromValue(input, AlarmStatus.class, AlarmStatus::getId);
    }
}