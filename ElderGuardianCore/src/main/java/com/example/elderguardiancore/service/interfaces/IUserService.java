package com.example.elderguardiancore.service.interfaces;

import com.example.elderguardiancore.pojo.dto.UserDTO;
import com.example.elderguardiancore.pojo.model.ResponseMessage;
import com.example.elderguardiancore.pojo.entity.User;
import com.example.elderguardiancore.pojo.request.BindCaregiverReq;
import com.example.elderguardiancore.pojo.request.BindFamilyReq;
import com.example.elderguardiancore.pojo.request.ElderHealthResReq;
import com.example.elderguardiancore.pojo.request.PageReq;
import com.example.elderguardiancore.pojo.response.ElderHealthRes;
import com.example.elderguardiancore.pojo.response.PageRes;

import java.util.List;
import java.util.Map;

public interface IUserService {
    /**
     * 添加用户
     * 
     * @param user 用户对象
     */
    User addUser(User user);

    User addUser(User user, boolean isFilter);

    /**
     * 查询用户
     * 
     * @param userId 用户ID
     * @return 用户对象
     */
    User getUser(Long userId);

    /**
     * 查询用户（可选密码过滤）
     * 
     * @param userId   用户ID
     * @param isFilter 是否过滤密码字段
     * @return 用户对象
     */
    User getUser(Long userId, boolean isFilter);

    /**
     * 通过手机号查询用户
     * 
     * @param phone 手机号
     * @return 用户对象
     */
    User getUserByPhone(String phone);

    /**
     * 查询用户列表
     * 
     * @return 用户列表
     */
    ResponseMessage<PageRes<UserDTO>> getUserList(PageReq pageReq, String token);

    /**
     * 修改用户
     * 
     * @param user 用户对象
     */
    User editUser(User user);

    /**
     * 一键解除用户所有绑定关系
     * 
     * @param user 用户对象
     * @return 解除绑定后的用户对象
     */
    User unBindAll(User user);

    /**
     * 删除用户
     * 
     * @param userId 用户ID
     */
    void deleteUser(Long userId);

    /**
     * 批量删除用户
     * 
     * @param userIds 用户ID列表
     */
    void deleteBatch(List<Long> userIds);

    /**
     * 通过用户ID列表查询用户列表
     * 
     * @param userIds 用户ID列表
     * @return 用户DTO列表
     */
    ResponseMessage<List<UserDTO>> getUserListByIds(List<Long> userIds);

    /**
     * 绑定用户健康设备
     * 
     * @param map 包含用户ID和设备ID的映射
     * @return 响应消息
     */
    ResponseMessage<String> bindHealthDevice(Map<String, Object> map);

    /**
     * 绑定家属
     * 
     * @param map 包含用户ID和家属ID的映射
     * @return 响应消息
     */
    ResponseMessage<String> bindFamily(BindFamilyReq req);

    /**
     * 绑定护理人员
     * 
     * @param map 包含用户ID和护理人员ID的映射
     * @return 响应消息
     */
    ResponseMessage<String> bindCaregiver(BindCaregiverReq req);

    /**
     * 获取老人所有健康数据
     * 
     * @param req 包含用户ID的请求对象
     * @return 健康数据响应对象
     */
    ResponseMessage<ElderHealthRes> getElderHealth(ElderHealthResReq req);
}
