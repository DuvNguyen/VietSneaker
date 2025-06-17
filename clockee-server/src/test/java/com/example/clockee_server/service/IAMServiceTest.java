// package com.example.clockee_server.service;

// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.BDDMockito.given;

// import java.util.List;
// import java.util.Optional;
// import java.util.Set;

// import com.example.clockee_server.entity.Role;
// import com.example.clockee_server.entity.RoleName;
// import com.example.clockee_server.entity.User;
// import com.example.clockee_server.mapper.UserMapper;
// import com.example.clockee_server.message.AppMessage;
// import com.example.clockee_server.payload.request.CreateLoginRequest;
// import com.example.clockee_server.payload.response.UserAccessDetailsResponse;
// import com.example.clockee_server.repository.RoleRepository;
// import com.example.clockee_server.repository.UserRepository;
// import com.example.clockee_server.service.admin.IAMService;

// import org.assertj.core.api.Assertions;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;

// /**
//  * GreetingServiceTest
//  */

// /*
//  * Help to create mock object and inject for service test
//  */
// @ExtendWith(MockitoExtension.class)
// public class IAMServiceTest {

//   @Mock
//   private UserRepository userRepository;

//   @Mock
//   private UserMapper userMapper;
//   @Mock
//   private RoleRepository roleRepository;

//   private Role roleUser;
//   private Role roleAdminProduct;

//   private User user1;
//   @InjectMocks
//   private IAMService iamService;

//   @BeforeEach
//   void setUp() {
//     roleUser = Role.builder()
//         .roleName(RoleName.CUSTOMER)
//         .roleId(1L)
//         .build();
//     roleAdminProduct = Role.builder()
//         .roleName(RoleName.PRODUCT_ADMIN)
//         .roleId(2L)
//         .build();

//     // Prepare test setup given
//     // given(applicationProperties.getGreeting()).willReturn("Hello");

//     user1 = User.builder()
//         .name("bob")
//         .email("bob@gmail.com")
//         .password("Supersecret!@#).com")
//         .roles(Set.of(roleUser, roleAdminProduct))
//         .build();
//     given(roleRepository.findByRoleName(RoleName.CUSTOMER)).willReturn(Optional.of(roleUser));
//
// given(roleRepository.findByRoleName(RoleName.PRODUCT_ADMIN)).willReturn(Optional.of(roleAdminProduct));
//   }

//   @Test
//   public void addUserLogin_success() {
//     var loginRequest = CreateLoginRequest.builder()
//         .name(user1.getName())
//         .email(user1.getEmail())
//         .password(user1.getPassword())
//         .passwordConfirmation(user1.getPassword())
//         .roles(List.of(roleUser.toString(), roleAdminProduct.toString()))
//         .build();
//     UserAccessDetailsResponse expectedResponse = UserAccessDetailsResponse.builder()
//         .email(user1.getEmail())
//         .name(user1.getName())
//         .build();

//     given(roleRepository.findAllByRoleNameIn(List.of(RoleName.CUSTOMER, RoleName.PRODUCT_ADMIN)))
//         .willReturn(Set.of(roleUser, roleAdminProduct));
//     given(userRepository.save(any(User.class))).willReturn(user1);
//     given(userMapper.userToAccessDetails(user1)).willReturn(expectedResponse);

//     var savedAccess = iamService.addLoginAccess(loginRequest);

//     Assertions.assertThat(savedAccess.getEmail()).isEqualTo(loginRequest.getEmail());

//   }

//   // @Test
//   // void shouldGreetWithDefaultNameWhenNameIsNotProvided() {
//   // given(applicationProperties.getDefaultName()).willReturn("World");
//   //
//   // String greeting = greetingService.sayHello(null);
//   // Assertions.assertEquals(greeting, "Hello World");
//   // }
//   //
//   // @Test
//   // void shouldGreetingInputName_whenNameisProvided() {
//   //
//   // String greeting = greetingService.sayHello("My");
//   // Assertions.assertEquals(greeting, "Hello My");
//   // }
//   //

// }
