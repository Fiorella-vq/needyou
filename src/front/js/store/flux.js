const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			user: null,
			token: localStorage.getItem("token") || null,
			workers: [],
			demo: [
				{ title: "FIRST", background: "white", initial: "white" },
				{ title: "SECOND", background: "white", initial: "white" }
			]
		},

		actions: {

			// -----------------------------
			// LOGIN 🔐
			// -----------------------------
			login: async (form) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(form)
					});

					const data = await resp.json();

					if (data.token) {
						localStorage.setItem("token", data.token);
						setStore({ token: data.token, user: data.user });
					}

					return data;

				} catch (error) {
					console.log("Error login", error);
				}
			},

			// -----------------------------
			// REGISTER 📝
			// -----------------------------
			register: async (form) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/register", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(form)
					});

					const data = await resp.json();
					return data;

				} catch (error) {
					console.log("Error register", error);
				}
			},

			// -----------------------------
			// GET WORKERS 🛠️
			// -----------------------------
			getWorkers: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/workers");
					const data = await resp.json();

					setStore({ workers: data });

				} catch (error) {
					console.log("Error loading workers", error);
				}
			},

			// -----------------------------
			// LOGOUT 🚪
			// -----------------------------
			logout: () => {
				localStorage.removeItem("token");
				setStore({ token: null, user: null });
			},

			// -----------------------------
			// TU CÓDIGO ORIGINAL
			// -----------------------------
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
					const data = await resp.json();
					setStore({ message: data.message });
					return data;
				} catch (error) {
					console.log("Error loading message", error);
				}
			},

			changeColor: (index, color) => {
				const store = getStore();

				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				setStore({ demo: demo });
			}
		}
	};
};

export default getState;