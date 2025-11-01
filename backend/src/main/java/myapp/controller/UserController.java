package myapp.controller;

import myapp.service.UserService;
import myapp.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import myapp.model.UserDto;
import java.util.List;
import myapp.config.SecurityConfig;

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
	@GetMapping
	public List<User> listUsers(){
		return userService.getAllUsers();
	}
}
