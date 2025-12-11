package myapp.service;

import myapp.model.User;
import myapp.model.MyUserDetails;
import myapp.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections; // for authorities

@Service
public class UsrDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public UsrDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        var userd = new MyUserDetails(user.getId(), user.getName(), user.getEmail(), user.getPassword(), null);
        return userd;
    }
}

