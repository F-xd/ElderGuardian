package com.example.elderguardiancore.pojo.request;

import java.util.List;

public class DeleteBatchReq {
    private List<Long> userIds;

    public List<Long> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Long> userIds) {
        this.userIds = userIds;
    }
}
