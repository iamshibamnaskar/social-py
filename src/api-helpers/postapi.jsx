class PostControlApi {
    static async createNewPost(jwtToken, userId, imageUrl, description) {
        const apiUrl = `http://localhost:5000/api/post/createwithimg/${userId}`;

        const headers = {
            "Authorization": `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
        };

        const body = JSON.stringify({
            caption: description,
            image: imageUrl,
        });

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: headers,
                body: body,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            return result; // Return the response from the API
        } catch (error) {
            console.error("Error creating new post:", error);
            throw error; // Propagate the error to the caller
        }
    }

    static async getAllPosts(jwtToken, userId) {
        const apiUrl = `http://localhost:5000/api/post/all/${userId}`;

        const headers = {
            "Authorization": `Bearer ${jwtToken}`,
        };

        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: headers,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            return result; // Return the posts data
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw error; // Propagate the error to the caller
        }
    }

    static async getAllPostsByUser(jwtToken, userId) {
        const apiUrl = `http://localhost:5000/api/post/user/${userId}`;

        const headers = {
            "Authorization": `Bearer ${jwtToken}`,
        };

        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: headers,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            return result; // Return the posts data
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw error; // Propagate the error to the caller
        }
    }

    static async getUserById(jwtToken, userId) {
        const apiUrl = `http://localhost:5000/api/user/${userId}`;

        const headers = {
            "Authorization": `Bearer ${jwtToken}`,
        };

        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: headers,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            return result; // Return the posts data
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw error; // Propagate the error to the caller
        }
    }

    static async likePost(jwtToken, userId, postId) {
        const apiUrl = `http://localhost:5000/api/post/like/${postId}`;

        const headers = {
            "Authorization": `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
        };

        const body = JSON.stringify({
            userId: userId,
        });

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: headers,
                body: body,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            return result; // Return the response from the API
        } catch (error) {
            console.error("Error liking the post:", error);
            throw error; // Propagate the error to the caller
        }
    }

    static async followUser(jwtToken, userId, userTofollow) {
        const apiUrl = `http://localhost:5000/api/user/follow/${userTofollow}`;

        const headers = {
            "Authorization": `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
        };

        const body = JSON.stringify({
            _id: userId,
        });

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: headers,
                body: body,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            return result; // Return the response from the API
        } catch (error) {
            console.error("Error following user:", error);
            throw error; // Propagate the error to the caller
        }
    }

    static async searchUser(jwtToken, query) {
        const apiUrl = `http://localhost:5000/api/user/search/${query}`;

        const headers = {
            "Authorization": `Bearer ${jwtToken}`,
        };

        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: headers,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            return result; // Return the posts data
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error; // Propagate the error to the caller
        }
    }
}

export default PostControlApi;