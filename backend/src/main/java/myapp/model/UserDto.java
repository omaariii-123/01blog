package myapp.model;

import lombok.*;

@NoArgsConstructor
@Data
public class UserDto{
	private String name;
	private String email;
	private String password;
}
