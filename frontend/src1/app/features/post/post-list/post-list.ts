import { Component } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-post-list',
  imports: [MatIconModule ,MatButtonModule, MatCardModule, MatListModule],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css'
})
export class PostList {
	posts = [{id: 1, title: "LOREM IPSUM", content : `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel viverra felis. Quisque hendrerit convallis sodales. Duis turpis ex, semper et consequat non, dignissim ac diam. Maecenas dictum elit nec mattis interdum. Nunc at euismod tortor, non cursus libero. Aenean dictum fringilla felis eu auctor. Nam a fermentum mauris. Nullam sed tristique magna. In et laoreet velit. Maecenas vestibulum dolor at ipsum laoreet, non finibus metus tristique. Fusce eget nunc quam. Nulla facilisi. Quisque quis aliquam ligula, eget consectetur odio.

Quisque eget elit augue. Suspendisse potenti. Nunc congue ligula ex, sit amet tristique tellus pulvinar et. Cras dictum libero in tellus dictum, vitae maximus sem cursus. Suspendisse sollicitudin et tellus tempor aliquam. Maecenas vulputate orci ac ipsum euismod, et eleifend orci viverra. Etiam posuere, eros gravida iaculis ultricies, ipsum turpis commodo ex, sit amet dignissim dolor dui id purus. Sed bibendum rutrum dapibus. Suspendisse diam nisl, elementum a dui at, eleifend vulputate lorem. Sed sed quam vestibulum, condimentum enim vel, accumsan nibh. Fusce et dolor enim. Vivamus dapibus viverra hendrerit. Maecenas ut diam volutpat, semper nunc faucibus, venenatis lacus. Integer tincidunt arcu eget purus porta, a auctor erat elementum.

Curabitur suscipit lobortis pulvinar. Vestibulum feugiat dui et leo mollis lobortis. Donec imperdiet, diam at aliquet pharetra, libero leo egestas tortor, ut ullamcorper urna lacus at ipsum. In hac habitasse platea dictumst. Maecenas laoreet magna nisl, nec vehicula turpis volutpat sit amet. Sed quis lorem nunc. Sed suscipit nisl sit amet lorem hendrerit, sit amet varius dui commodo. Maecenas id hendrerit dui. Fusce imperdiet sit amet felis sit amet pulvinar. Aliquam faucibus dictum metus, id tempus mi porta eget. Suspendisse potenti. In auctor purus quam, id dapibus erat aliquam sed.`},
			{id: 1, title: "LOREM IPSUM", content : "test"},
			{id: 1, title: "LOREM IPSUM", content : "test"},
			{id: 1, title: "LOREM IPSUM", content : "test"},
	];

}
