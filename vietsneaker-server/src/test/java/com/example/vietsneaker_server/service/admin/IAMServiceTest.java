package com.example.vietsneaker_server.service.admin;

import com.example.vietsneaker_server.entity.Role;
import com.example.vietsneaker_server.entity.RoleName;
import com.example.vietsneaker_server.entity.User;
import com.example.vietsneaker_server.exception.ApiException;
import com.example.vietsneaker_server.exception.ResourceNotFoundException;
import com.example.vietsneaker_server.mapper.UserMapper;
import com.example.vietsneaker_server.payload.PageResponse;
import com.example.vietsneaker_server.payload.request.CreateLoginRequest;
import com.example.vietsneaker_server.payload.request.SetPasswordRequest;
import com.example.vietsneaker_server.payload.request.UserRoleRequest;
import com.example.vietsneaker_server.payload.response.UserAccessDetailsResponse;
import com.example.vietsneaker_server.repository.RoleRepository;
import com.example.vietsneaker_server.repository.UserRepository;
import com.example.vietsneaker_server.util.ApplicationContextProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IAMServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private IAMService iamService;

    private User testUser;
    private Role testRole;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUserId(1L);
        testUser.setEmail("test@example.com");
        testUser.setEnabled(true);
        testUser.setRoles(new HashSet<>());

        testRole = new Role();
        testRole.setRoleId(1L);
        testRole.setRoleName(RoleName.CUSTOMER);
        testRole.setUsers(new HashSet<>());
    }

    @Test
    void getAllUserAccess_ShouldReturnPageOfUserAccessDetails() {
        try (MockedStatic<ApplicationContextProvider> mocked = Mockito.mockStatic(ApplicationContextProvider.class)) {
            Pageable pageable = PageRequest.of(0, 10);
            Page<User> userPage = new PageImpl<>(Collections.singletonList(testUser));
            when(userRepository.findAllWithRoles(pageable)).thenReturn(userPage);
            when(userMapper.userToAccessDetails(any(User.class))).thenReturn(new UserAccessDetailsResponse());

            PageResponse<UserAccessDetailsResponse> result = iamService.getAllUserAccess(0, 10);

            assertNotNull(result);
            assertEquals(1, result.getContent().size());
            verify(userRepository, times(1)).findAllWithRoles(pageable);
            verify(userMapper, times(1)).userToAccessDetails(testUser);
        }
    }

    @Test
    void toggleEnableStatus_UserFound_ShouldToggleStatus() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        boolean newStatus = iamService.toggleEnableStatus(1L);

        assertFalse(newStatus);
        assertFalse(testUser.getEnabled());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void toggleEnableStatus_UserNotFound_ShouldThrowException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> iamService.toggleEnableStatus(1L));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void addRole_ValidRequest_ShouldAddRoleToUser() {
        UserRoleRequest request = new UserRoleRequest(1L, "CUSTOMER");
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roleRepository.findByRoleName(RoleName.CUSTOMER)).thenReturn(Optional.of(testRole));

        iamService.addRole(request);

        assertTrue(testUser.getRoles().contains(testRole));
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void addRole_UserNotFound_ShouldThrowException() {
        UserRoleRequest request = new UserRoleRequest(1L, "CUSTOMER");
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> iamService.addRole(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void addRole_RoleNotFound_ShouldThrowException() {
        UserRoleRequest request = new UserRoleRequest(1L, "PRODUCT_ADMIN");
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roleRepository.findByRoleName(RoleName.PRODUCT_ADMIN)).thenReturn(Optional.empty());

        assertThrows(ApiException.class, () -> iamService.addRole(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void removeRole_ValidRequest_ShouldRemoveRoleFromUser() {
        testUser.addRole(testRole);
        UserRoleRequest request = new UserRoleRequest(1L, "CUSTOMER");
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roleRepository.findByRoleName(RoleName.CUSTOMER)).thenReturn(Optional.of(testRole));

        iamService.removeRole(request);

        assertFalse(testUser.getRoles().contains(testRole));
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void addLoginAccess_ShouldCreateAndSaveUser() {
        try (MockedStatic<ApplicationContextProvider> mocked = Mockito.mockStatic(ApplicationContextProvider.class)) {
            mocked.when(() -> ApplicationContextProvider.bean(PasswordEncoder.class)).thenReturn(passwordEncoder);
            when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

            CreateLoginRequest request = new CreateLoginRequest("new@example.com", "password", "password", "New User", List.of("CUSTOMER"));
            when(roleRepository.findAllByRoleNameIn(any())).thenReturn(Set.of(testRole));
            when(userRepository.save(any(User.class))).thenAnswer(i -> {
                User u = i.getArgument(0);
                u.setUserId(2L);
                return u;
            });
            when(userMapper.userToAccessDetails(any(User.class))).thenReturn(new UserAccessDetailsResponse());

            UserAccessDetailsResponse response = iamService.addLoginAccess(request);

            assertNotNull(response);
            verify(userRepository, times(1)).save(any(User.class));
        }
    }

    @Test
    void getUserAccess_UserFound_ShouldReturnUserDetails() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userMapper.userToAccessDetails(testUser)).thenReturn(new UserAccessDetailsResponse());

        UserAccessDetailsResponse response = iamService.getUserAccess(1L);

        assertNotNull(response);
        verify(userMapper, times(1)).userToAccessDetails(testUser);
    }

    @Test
    void setPassword_UserFound_ShouldUpdatePassword() {
        try (MockedStatic<ApplicationContextProvider> mocked = Mockito.mockStatic(ApplicationContextProvider.class)) {
            mocked.when(() -> ApplicationContextProvider.bean(PasswordEncoder.class)).thenReturn(passwordEncoder);
            when(passwordEncoder.encode(anyString())).thenReturn("newEncodedPassword");

            SetPasswordRequest request = new SetPasswordRequest("newPassword", "newPassword");
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

            iamService.setPassword(1L, request);

            verify(userRepository, times(1)).save(testUser);
            assertEquals("newEncodedPassword", testUser.getPassword());
        }
    }
}
