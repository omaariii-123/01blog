package myapp.controller;

import myapp.service.UserService;
import myapp.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import myapp.model.UserDto;
import java.util.List;
import myapp.config.SecurityConfig;
import java.security.Principal;
import org.springframework.security.core.Authentication;
import myapp.model.MyUserDetails;
import jakarta.servlet.http.Cookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;



@RestController
@RequestMapping("/api/users")
public class UserController{
	private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
	
	@PostMapping("/register")
	public ResponseEntity<User> createUser(@RequestBody UserDto user){
		user.setPassword(this.userService.encodePassword(user.getPassword()));
		User usr = userService.saveUser(user);
		usr.setPassword("");

		return ResponseEntity.ok(usr);
	}/*
	@PostMapping("/logout")
	public ResponseEntity<?> login(){

    ResponseCookie cookie = ResponseCookie.from("myCookieName", "myCookieValue")
        .httpOnly(true)
                .secure(false) // <--- Set to FALSE for HTTP connections
                .path("/")
                .maxAge(360000) // Set maxAge to 0 to expire the cookie immediately
                .sameSite("None") // Explicitly set to Lax, or just omit this line
                .build();		

			return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body("test");
	}*/
	@GetMapping("/status")
	public ResponseEntity<?> checkStatus(Authentication authentication) {
			if (authentication == null || !authentication.isAuthenticated()|| authentication.getPrincipal().equals("anonymousUser")) {
				return ResponseEntity.status(403).body("!!!");	
			}
				MyUserDetails principal = (MyUserDetails) authentication.getPrincipal();
				System.out.println(principal.getName());
				User user = userService.login(principal.getEmail());
				UserDto userd = new UserDto();
				userd.setName(user.getName());
				userd.setEmail(user.getEmail());
				return ResponseEntity.ok(userd);
	}


	@GetMapping
	public List<User> listUsers(){
		return userService.getAllUsers();
	}
}
