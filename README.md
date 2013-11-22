![Una](logo.png)

Una
==

Una is a free and open source Javascript library that allows developers to create interactive applications where multiple users can interact with large central displays in real-time using mobile devices. We have developed a product site for interested developers to find out more about Una, try it out for themselves and potentially contribute to the development of Una!


### Working Applications

We have built a whole ton of stuff in the past 6 weeks. Here's a list of them:

#### Nutty Ninjas

**Directory Path**: `src/nuttyninjas`

##### Instructions
1. On your desktop/laptop, using a modern browser (preferably Chrome), go to [http://www.nuttyninjas.com](http://www.nuttyninjas.com).
2. Click on “Create Game”, and take note of the room number.
3. On your mobile phone, go to [http://www.nuttyninjas.com](http://www.nuttyninjas.com).
4. Enter the room number into the input field and press join.
5. After entering your name and selecting your Ninja, proceed to play.
6. Hold your mobile device in landscape mode. It is now your controller that controls the Ninja shown on the screen.
7. Invite your friend beside you to join in and start throwing ninja stars!

#### Shakeoff

**Directory Path**: `src/shakeoff`

##### Instructions
1. On your browser, go to [http://shake.lvtien.com/results](http://shake.lvtien.com/results)
2. On your mobile phone, go to [http://shake.lvtien.com](http://shake.lvtien.com)
3. Choose Team Android or Team Apple on your mobile phone, and start shaking to show support for your favourite brand.

#### Una Library

- **Directory Path**: `src/una`
- Submodule of Una [(https://github.com/una-org/una)](https://github.com/una-org/una)

#### Una Landing Site

- **Directory Path**: `src/una-org.github.io`
- Submodule of Una landing site [(https://github.com/una-org/una-org.github.io)](https://github.com/una-org/una-org.github.io)

#### Sudoku

- **Directory Path**: `src/sudoku`
- Abandoned sudoku effort


### The Team

- **Soon Chun Mun** - A0081223U
- **Le Viet Tien** - A0088447N
- **Tay Yang Shun** - A0073063M
- **Soedarsono** - A0078541B


### Deployment tools

1. Install [`virtualenv`](http://www.virtualenv.org/en/latest/#installation) for python
2. `cd deploytools && virtualenv deploy`
3. `source deploy/bin/activate`
4. `pip install -r requirement.txt`
5. Deploy with `fab deploy`
