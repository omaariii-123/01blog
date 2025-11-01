package myapp.model;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;
import org.springframework.security.core.userdetails.UserDetails;
import lombok.*;

@Data
@RequiredArgsConstructor
public class MyUserDetails implements UserDetails {
	private final String name;
	private final String email;
	private final String password;
	private final Collection<? extends GrantedAuthority> authorities;
	@Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email; // We use email as the username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Usually return true unless you have specific expiration logic
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Usually return true unless you have specific locking logic
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Usually return true unless you have specific password expiry logic
    }

    @Override
    public boolean isEnabled() {
        return true; // Usually return true unless you manually disable users
    }

}
