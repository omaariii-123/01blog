package myapp.service;

import myapp.model.User;
import myapp.model.UserDto;
import myapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@RequiredArgsConstructor
@Service
public class UserService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	public User saveUser(UserDto user){
		User usr = new User();
		usr.setName(user.getName());
		usr.setEmail(user.getEmail());
		usr.setPassword(user.getPassword());
		return userRepository.save(usr);
	}
	public String encodePassword(String password) {
		return this.passwordEncoder.encode(password);
	}
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getByName(String username) {
        return userRepository.findByName(username);
    }
	public User login(String email) {
		return userRepository.findByEmail(email).orElse(null);
	}
}
