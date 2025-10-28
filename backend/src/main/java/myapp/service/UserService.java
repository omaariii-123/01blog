package myapp.service;

import myapp.model.User;
import myapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RequiredArgsConstructor
@Service
public class UserService {
	private final UserRepository userRepository;

	public User saveUser(User user){
		return userRepository.save(user);
	}

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getByName(String username) {
        return userRepository.findByName(username);
    }
}
