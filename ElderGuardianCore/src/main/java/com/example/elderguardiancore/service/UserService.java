package com.example.elderguardiancore.service;

import com.example.elderguardiancore.dao.DeviceDao;
import com.example.elderguardiancore.dao.HealthDataDao;
import com.example.elderguardiancore.dao.HealthDeviceDao;
import com.example.elderguardiancore.dao.RoomDao;
import com.example.elderguardiancore.dao.UserDao;
import com.example.elderguardiancore.mapper.DeviceSummaryMapper;
import com.example.elderguardiancore.mapper.UserMapper;
import com.example.elderguardiancore.pojo.dto.UserDTO;
import com.example.elderguardiancore.pojo.model.ResponseMessage;
import com.example.elderguardiancore.pojo.entity.Device;
import com.example.elderguardiancore.pojo.entity.HealthDevice;
import com.example.elderguardiancore.pojo.entity.Room;
import com.example.elderguardiancore.pojo.entity.User;
import com.example.elderguardiancore.pojo.enums.Gender;
import com.example.elderguardiancore.pojo.enums.Role;
import com.example.elderguardiancore.pojo.request.BindCaregiverReq;
import com.example.elderguardiancore.pojo.request.BindFamilyReq;
import com.example.elderguardiancore.pojo.request.ElderHealthResReq;
import com.example.elderguardiancore.pojo.request.PageReq;
import com.example.elderguardiancore.pojo.response.ElderHealthRes;
import com.example.elderguardiancore.pojo.response.PageRes;
import com.example.elderguardiancore.service.interfaces.IUserService;
import com.example.elderguardiancore.utils.CalculationUtils;
import com.example.elderguardiancore.utils.ConditionUtils;
import com.example.elderguardiancore.utils.PageableUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service // spring 的 bean 组件
public class UserService implements IUserService {
    @Autowired
    UserDao userDao;
    @Autowired
    UserMapper userMapper;
    @Autowired
    DeviceSummaryMapper deviceSummaryMapper;
    @Autowired
    RoomDao roomDao;
    @Autowired
    HealthDeviceDao healthDeviceDao;
    @Autowired
    DeviceDao deviceDao;
    @Autowired
    HealthDataDao healthDataDao;

    @Override
    public User addUser(User user) {
        // 调用 dao 层的方法添加用户
        return userDao.save(user);
    }

    @Override
    public User addUser(User user, boolean isFilter) {
        User addedUser = userDao.save(user);
        if (isFilter) {
            addedUser.setPassword(null);
        }
        return addedUser;
    }

    @Override
    public User getUser(Long userId) {
        // 调用 dao 层的方法查询用户
        return userDao.findById(userId).orElse(null);
    }

    @Override
    public User getUser(Long userId, boolean isFilter) {
        // 调用 dao 层的方法查询用户
        User user = userDao.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }
        if (isFilter) {
            user.setPassword(null);
        }
        return user;
    }

    @Override
    public ResponseMessage<PageRes<UserDTO>> getUserList(PageReq pageReq) {
        // 从请求参数中提取条件
        ConditionUtils conditionUtils = new ConditionUtils(pageReq.getCondition());
        // 构建查询条件
        String userName = conditionUtils.getString("userName");
        String phone = conditionUtils.getString("phone");
        Gender gender = conditionUtils.getEnum("gender", Gender.class);
        Role role = conditionUtils.getEnum("role", Role.class);
        LocalDate minBirthday = conditionUtils.getLocalDate("minBirthday");
        LocalDate maxBirthday = conditionUtils.getLocalDate("maxBirthday");

        // 创建Pageable对象
        Pageable pageable = PageableUtils.createPageable(pageReq);
        // 调用 dao 层方法进行条件查询
        Page<User> users = userDao.findByConditions(
                userName,
                phone,
                gender,
                role,
                minBirthday,
                maxBirthday,
                pageable);
        List<UserDTO> userDTOList = userMapper.toUserDTOList(users.getContent());

        PageRes<UserDTO> pageRes = new PageRes<>(users, userDTOList);
        return ResponseMessage.success(pageRes);
    }

    @Override
    public User getUserByPhone(String phone) {
        // 调用 dao 层的方法查询用户
        return userDao.findByPhone(phone);
    }

    @Override
    public User editUser(User user) {
        // 调用 dao 层的方法修改用户
        return userDao.save(user);
    }

    @Override
    public void deleteUser(Long userId) {
        // 首先获取用户信息，检查是否有绑定的房间
        User user = userDao.findById(userId).orElse(null);
        Room room = null;
        if (user != null && user.getRoom() != null) {
            room = user.getRoom();
        }

        unBindAll(user);
        // 调用 dao 层的方法删除用户
        userDao.deleteById(userId);

        // 如果用户有绑定的房间，更新房间信息
        if (room != null) {
            // 重新获取房间信息，计算当前人数
            Room updatedRoom = roomDao.findById(room.getRoomId()).orElse(null);
            if (updatedRoom != null) {
                int currentCount = updatedRoom.getUsers() != null ? updatedRoom.getUsers().size() : 0;
                updatedRoom.setCurrentCount(currentCount);

                // 计算入住率
                Double occupancyRate = CalculationUtils.calculateOccupancyRate(currentCount,
                        updatedRoom.getMaxCapacity());
                updatedRoom.setOccupancyRate(occupancyRate);

                roomDao.save(updatedRoom);
            }
        }
    }

    @Override
    public void deleteBatch(List<Long> userIds) {
        // 首先收集所有用户绑定的房间
        List<Room> roomsToUpdate = new ArrayList<>();
        for (Long userId : userIds) {
            User user = userDao.findById(userId).orElse(null);
            if (user != null && user.getRoom() != null) {
                Room room = user.getRoom();
                if (!roomsToUpdate.contains(room)) {
                    roomsToUpdate.add(room);
                }
            }
            unBindAll(user);
        }

        // 调用 dao 层的方法批量删除用户
        userDao.deleteAllById(userIds);

        // 更新相关房间的信息
        for (Room room : roomsToUpdate) {
            Room updatedRoom = roomDao.findById(room.getRoomId()).orElse(null);
            if (updatedRoom != null) {
                int currentCount = updatedRoom.getUsers() != null ? updatedRoom.getUsers().size() : 0;
                updatedRoom.setCurrentCount(currentCount);

                // 计算入住率
                Double occupancyRate = CalculationUtils.calculateOccupancyRate(currentCount,
                        updatedRoom.getMaxCapacity());
                updatedRoom.setOccupancyRate(occupancyRate);

                roomDao.save(updatedRoom);
            }
        }
    }

    @Override
    public ResponseMessage<List<UserDTO>> getUserListByIds(List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return ResponseMessage.success(new ArrayList<>());
        }
        List<User> users = (List<User>) userDao.findAllById(userIds);
        List<UserDTO> userDTOList = userMapper.toUserDTOList(users);
        return ResponseMessage.success(userDTOList);
    }

    @Override
    public ResponseMessage<String> bindHealthDevice(Map<String, Object> map) {
        // 解析传参（JSON数字会被解析为Integer，需要通过Number转换）
        Long elderId = ((Number) map.get("elderId")).longValue();
        List<?> healthDeviceIds = (List<?>) map.get("healthDeviceIds");
        Long healthDeviceId = null;
        if (healthDeviceIds != null && !healthDeviceIds.isEmpty() && healthDeviceIds.get(0) != null) {
            healthDeviceId = ((Number) healthDeviceIds.get(0)).longValue();
        }

        // 查询用户
        User user = userDao.findById(elderId).orElse(null);
        if (user == null) {
            return ResponseMessage.error("用户不存在");
        }
        // 没有设备则置空
        if (healthDeviceId == null) {
            user.setHealthDevice(null);
        } else {
            HealthDevice healthDevice = healthDeviceDao.findById(healthDeviceId).orElse(null);
            if (healthDevice == null) {
                return ResponseMessage.error("设备不存在");
            }
            // 绑定设备
            user.setHealthDevice(healthDevice);
        }
        userDao.save(user);
        return ResponseMessage.success(null, "绑定成功");
    }

    @Override
    public ResponseMessage<String> bindFamily(BindFamilyReq req) {
        Long elderId = req.getElderId();
        Set<Long> familyIds = req.getFamilyIds();
        User elderUser = userDao.findById(elderId).orElse(null);
        if (elderUser == null) {
            return ResponseMessage.error("用户不存在");
        }
        // 处理旧家属
        Set<Long> oldFamilyIds = elderUser.getFamilyIds();
        if (oldFamilyIds != null && !oldFamilyIds.isEmpty()) {
            for (Long oldFamilyId : oldFamilyIds) {
                User oldFamilyUser = userDao.findById(oldFamilyId).orElse(null);
                if (oldFamilyUser != null) {
                    Set<Long> elderIds = oldFamilyUser.getElderIds();
                    if (elderIds != null) {
                        elderIds.remove(elderId);
                        oldFamilyUser.setElderIds(elderIds);
                        userDao.save(oldFamilyUser);
                    }
                }
            }
        }
        // 处理家属用户
        for (Long familyId : familyIds) {
            User familyUser = userDao.findById(familyId).orElse(null);
            if (familyUser == null) {
                return ResponseMessage.error("家属不存在");
            }
            Set<Long> elderIds = familyUser.getElderIds();
            if (elderIds == null) {
                elderIds = new HashSet<>();
            }
            elderIds.add(elderId);
            familyUser.setElderIds(elderIds);
            userDao.save(familyUser);
        }
        elderUser.setFamilyIds(familyIds);
        userDao.save(elderUser);
        return ResponseMessage.success(null, "绑定成功");
    }

    @Override
    public ResponseMessage<String> bindCaregiver(BindCaregiverReq req) {
        Long elderId = req.getElderId();
        Set<Long> caregiverIds = req.getCaregiverIds();
        User elderUser = userDao.findById(elderId).orElse(null);
        if (elderUser == null) {
            return ResponseMessage.error("用户不存在");
        }
        // 处理旧护理人员
        Set<Long> oldCaregiverIds = elderUser.getCaregiverIds();
        if (oldCaregiverIds != null && !oldCaregiverIds.isEmpty()) {
            User oldCaregiverUser = userDao.findById(oldCaregiverIds.iterator().next()).orElse(null);
            if (oldCaregiverUser != null) {
                Set<Long> oldElderIds = oldCaregiverUser.getElderIds();
                oldElderIds.remove(elderId);
                oldCaregiverUser.setElderIds(oldElderIds);
                userDao.save(oldCaregiverUser);
            }
        }
        // 绑定新护理人员
        if (caregiverIds != null && !caregiverIds.isEmpty()) {
            Long caregiverId = null;
            caregiverId = caregiverIds.iterator().next();
            User caregiverUser = userDao.findById(caregiverId).orElse(null);
            if (caregiverUser == null) {
                return ResponseMessage.error("护理人员不存在");
            }
            Set<Long> elderIds = caregiverUser.getElderIds();
            if (elderIds == null) {
                elderIds = new HashSet<>();
            }
            elderIds.add(elderId);
            caregiverUser.setElderIds(elderIds);
            userDao.save(caregiverUser);
        }

        elderUser.setCaregiverIds(caregiverIds);
        userDao.save(elderUser);
        return ResponseMessage.success(null, "绑定成功");
    }

    @Override
    public User unBindAll(User user) {
        Role role = user.getRole();
        switch (role) {
            case ELDER: {
                // 处理家属
                Set<Long> familyIds = user.getFamilyIds();
                if (familyIds != null && !familyIds.isEmpty()) {
                    for (Long familyId : familyIds) {
                        User familyUser = userDao.findById(familyId).orElse(null);
                        if (familyUser != null) {
                            Set<Long> elderIds = familyUser.getElderIds();
                            if (elderIds != null) {
                                elderIds.remove(user.getUserId());
                                familyUser.setElderIds(elderIds);
                                userDao.save(familyUser);
                            }
                        }
                    }
                }
                // 处理护理人员
                Set<Long> caregiverIds = user.getCaregiverIds();
                if (caregiverIds != null && !caregiverIds.isEmpty()) {
                    for (Long caregiverId : caregiverIds) {
                        User caregiverUser = userDao.findById(caregiverId).orElse(null);
                        if (caregiverUser != null) {
                            Set<Long> elderIds = caregiverUser.getElderIds();
                            if (elderIds != null) {
                                elderIds.remove(user.getUserId());
                                caregiverUser.setElderIds(elderIds);
                                userDao.save(caregiverUser);
                            }
                        }
                    }
                }
                break;
            }
            case FAMILY: {
                // 处理老人
                Set<Long> elderIds = user.getElderIds();
                if (elderIds != null && !elderIds.isEmpty()) {
                    for (Long elderId : elderIds) {
                        User elderUser = userDao.findById(elderId).orElse(null);
                        if (elderUser != null) {
                            Set<Long> familyIds = elderUser.getFamilyIds();
                            if (familyIds != null) {
                                familyIds.remove(user.getUserId());
                                elderUser.setFamilyIds(familyIds);
                                userDao.save(elderUser);
                            }
                        }
                    }
                }
                break;
            }
            case CAREGIVER: {
                // 处理老人
                Set<Long> elderIds = user.getElderIds();
                if (elderIds != null && !elderIds.isEmpty()) {
                    for (Long elderId : elderIds) {
                        User elderUser = userDao.findById(elderId).orElse(null);
                        if (elderUser != null) {
                            Set<Long> caregiverIds = elderUser.getCaregiverIds();
                            if (caregiverIds != null) {
                                caregiverIds.remove(user.getUserId());
                                elderUser.setCaregiverIds(caregiverIds);
                                userDao.save(elderUser);
                            }
                        }
                    }
                }
                break;
            }
            default:
                break;
        }
        user.setFamilyIds(null);
        user.setCaregiverIds(null);
        user.setElderIds(null);
        return user;
    }

    @Override
    public ResponseMessage<ElderHealthRes> getElderHealth(ElderHealthResReq req) {
        Long userId = req.getUserId();
        Long minTime = req.getMinTime();
        Long maxTime = req.getMaxTime();
        // 验证userId不能为null
        if (userId == null) {
            return ResponseMessage.success(null);
        }

        User user = userDao.findById(userId).orElse(null);
        if (user == null) {
            return ResponseMessage.error("用户不存在");
        }
        ElderHealthRes res = new ElderHealthRes(user);
        Room room = user.getRoom();
        if (room != null) {
            res.setRoomDevice(deviceSummaryMapper.toDTO(room.getDevice()));
        }
        HealthDevice healthDevice = user.getHealthDevice();
        if (healthDevice != null) {
            res.setHealthDatas(healthDataDao.findByConditions(healthDevice.getDeviceId(), minTime, maxTime));
        }
        return ResponseMessage.success(res);
    }
}
