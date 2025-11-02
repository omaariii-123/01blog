package myapp.controller;

import myapp.service.UserService;
import myapp.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import myapp.model.UserDto;
import java.util.List;
import myapp.config.SecurityConfig;
import java.security.Principal;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController{
	private final UserService userService;
	
	@PostMapping("/register")
	public ResponseEntity<User> createUser(@RequestBody UserDto user){
		user.setPassword(this.userService.encodePassword(user.getPassword()));
		User usr = userService.saveUser(user);
		usr.setPassword("");

		return ResponseEntity.ok(usr);
	}/*
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody UserDto usr){
		User user = userService.login(usr.getEmail());
		if (user == null){
			return ResponseEntity.status(404).body("user not found !");
		}else if (!user.getPassword().equals(usr.getPassword())) {
			return ResponseEntity.status(401).body("invalide Password or Email !");
		}
		user.setPassword("");
		return ResponseEntity.ok(user);

	}*/
	@GetMapping("/status")
	public ResponseEntity<?> checkStatus(Principal principal) {
			if (principal != null) {
			User user = userService.login(principal.getName());
			UserDto userd = new UserDto();
			user.setName(user.getName());
			user.setEmail(user.getEmail());
			return ResponseEntity.ok(userd);
			} 
			return ResponseEntity.status(403).body("!!!");
	}

	@GetMapping
	public List<User> listUsers(){
		return userService.getAllUsers();
	}
}
