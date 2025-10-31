package myapp.repository;

import java.util.Optional;
import myapp.model.User;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	User findByName(String username);
	User findById(int id);
	Optional<User> findByEmail(String email);
	List<User> findByNameAndEmail(String username, String email);
}
