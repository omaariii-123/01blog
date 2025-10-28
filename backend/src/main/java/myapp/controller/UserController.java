package myapp.controller;

import myapp.service.UserService;
import myapp.model.User;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController{
	private final UserService userService;
	
	@PostMapping
	public User createUser(User user){
		return userService.saveUser(user);
	} 
	@GetMapping
	public List<User> listUsers(){
		return userService.getAllUsers();
	}
}
