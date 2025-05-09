import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  TwitterAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  onIdTokenChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPopup,
  updateEmail,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail
} from "./chunk-EGMPVZFU.js";
import "./chunk-C5HNESJP.js";
import {
  require_react
} from "./chunk-4SFRHSJ3.js";
import {
  __toESM
} from "./chunk-EQCVQC35.js";

// node_modules/react-firebase-hooks/auth/dist/index.esm.js
var import_react = __toESM(require_react());
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var defaultState = function(defaultValue) {
  return {
    loading: defaultValue === void 0 || defaultValue === null,
    value: defaultValue
  };
};
var reducer = function() {
  return function(state, action) {
    switch (action.type) {
      case "error":
        return __assign(__assign({}, state), { error: action.error, loading: false, value: void 0 });
      case "reset":
        return defaultState(action.defaultValue);
      case "value":
        return __assign(__assign({}, state), { error: void 0, loading: false, value: action.value });
      default:
        return state;
    }
  };
};
var useLoadingValue = function(getDefaultValue) {
  var defaultValue = getDefaultValue ? getDefaultValue() : void 0;
  var _a = (0, import_react.useReducer)(reducer(), defaultState(defaultValue)), state = _a[0], dispatch = _a[1];
  var reset = (0, import_react.useCallback)(function() {
    var defaultValue2 = getDefaultValue ? getDefaultValue() : void 0;
    dispatch({ type: "reset", defaultValue: defaultValue2 });
  }, [getDefaultValue]);
  var setError = (0, import_react.useCallback)(function(error) {
    dispatch({ type: "error", error });
  }, []);
  var setValue = (0, import_react.useCallback)(function(value) {
    dispatch({ type: "value", value });
  }, []);
  return (0, import_react.useMemo)(function() {
    return {
      error: state.error,
      loading: state.loading,
      reset,
      setError,
      setValue,
      value: state.value
    };
  }, [state.error, state.loading, reset, setError, setValue, state.value]);
};
var useAuthState = function(auth, options) {
  var _a = useLoadingValue(function() {
    return auth.currentUser;
  }), error = _a.error, loading = _a.loading, setError = _a.setError, setValue = _a.setValue, value = _a.value;
  (0, import_react.useEffect)(function() {
    var listener = onAuthStateChanged(auth, function(user) {
      return __awaiter(void 0, void 0, void 0, function() {
        var e_1;
        return __generator(this, function(_a2) {
          switch (_a2.label) {
            case 0:
              if (!(options === null || options === void 0 ? void 0 : options.onUserChanged)) return [3, 4];
              _a2.label = 1;
            case 1:
              _a2.trys.push([1, 3, , 4]);
              return [4, options.onUserChanged(user)];
            case 2:
              _a2.sent();
              return [3, 4];
            case 3:
              e_1 = _a2.sent();
              setError(e_1);
              return [3, 4];
            case 4:
              setValue(user);
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, setError);
    return function() {
      listener();
    };
  }, [auth]);
  return [value, loading, error];
};
var useCreateUserWithEmailAndPassword = function(auth, options) {
  var _a = (0, import_react.useState)(), error = _a[0], setError = _a[1];
  var _b = (0, import_react.useState)(), registeredUser = _b[0], setRegisteredUser = _b[1];
  var _c = (0, import_react.useState)(false), loading = _c[0], setLoading = _c[1];
  var createUserWithEmailAndPassword$1 = (0, import_react.useCallback)(function(email, password) {
    return __awaiter(void 0, void 0, void 0, function() {
      var user, error_1;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            setLoading(true);
            setError(void 0);
            _a2.label = 1;
          case 1:
            _a2.trys.push([1, 5, 6, 7]);
            return [4, createUserWithEmailAndPassword(auth, email, password)];
          case 2:
            user = _a2.sent();
            if (!(options && options.sendEmailVerification && user.user)) return [3, 4];
            return [4, sendEmailVerification(user.user, options.emailVerificationOptions)];
          case 3:
            _a2.sent();
            _a2.label = 4;
          case 4:
            setRegisteredUser(user);
            return [2, user];
          case 5:
            error_1 = _a2.sent();
            setError(error_1);
            return [3, 7];
          case 6:
            setLoading(false);
            return [
              7
              /*endfinally*/
            ];
          case 7:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }, [auth, options]);
  return [createUserWithEmailAndPassword$1, registeredUser, loading, error];
};
var useDeleteUser = function(auth) {
  var _a = (0, import_react.useState)(), error = _a[0], setError = _a[1];
  var _b = (0, import_react.useState)(false), loading = _b[0], setLoading = _b[1];
  var deleteUser = (0, import_react.useCallback)(function() {
    return __awaiter(void 0, void 0, void 0, function() {
      var err_1;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            setLoading(true);
            setError(void 0);
            _a2.label = 1;
          case 1:
            _a2.trys.push([1, 5, 6, 7]);
            if (!auth.currentUser) return [3, 3];
            return [4, auth.currentUser.delete()];
          case 2:
            _a2.sent();
            return [2, true];
          case 3:
            throw new Error("No user is logged in");
          case 4:
            return [3, 7];
          case 5:
            err_1 = _a2.sent();
            setError(err_1);
            return [2, false];
          case 6:
            setLoading(false);
            return [
              7
              /*endfinally*/
            ];
          case 7:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }, [auth]);
  return [deleteUser, loading, error];
};
var useSendEmailVerification = function(auth) {
  var _a = (0, import_react.useState)(), error = _a[0], setError = _a[1];
  var _b = (0, import_react.useState)(false), loading = _b[0], setLoading = _b[1];
  var sendEmailVerification$1 = (0, import_react.useCallback)(function() {
    return __awaiter(void 0, void 0, void 0, function() {
      var err_1;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            setLoading(true);
            setError(void 0);
            _a2.label = 1;
          case 1:
            _a2.trys.push([1, 5, 6, 7]);
            if (!auth.currentUser) return [3, 3];
            return [4, sendEmailVerification(auth.currentUser)];
          case 2:
            _a2.sent();
            return [2, true];
          case 3:
            throw new Error("No user is logged in");
          case 4:
            return [3, 7];
          case 5:
            err_1 = _a2.sent();
            setError(err_1);
            return [2, false];
          case 6:
            setLoading(false);
            return [
              7
              /*endfinally*/
            ];
          case 7:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }, [auth]);
  return [sendEmailVerification$1, loading, error];
};
var useSendPasswordResetEmail = function(auth) {
  var _a = (0, import_react.useState)(), error = _a[0], setError = _a[1];
  var _b = (0, import_react.useState)(false), loading = _b[0], setLoading = _b[1];
  var sendPasswordResetEmail$1 = (0, import_react.useCallback)(function(email, actionCodeSettings) {
    return __awaiter(void 0, void 0, void 0, function() {
      var err_1;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            setLoading(true);
            setError(void 0);
            _a2.label = 1;
          case 1:
            _a2.trys.push([1, 3, 4, 5]);
            return [4, sendPasswordResetEmail(auth, email, actionCodeSettings)];
          case 2:
            _a2.sent();
            return [2, true];
          case 3:
            err_1 = _a2.sent();
            setError(err_1);
            return [2, false];
          case 4:
            setLoading(false);
            return [
              7
              /*endfinally*/
            ];
          case 5:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }, [auth]);
  return [sendPasswordResetEmail$1, loading, error];
};
var useSendSignInLinkToEmail = function(auth) {
  var _a = (0, import_react.useState)(), error = _a[0], setError = _a[1];
  var _b = (0, import_react.useState)(false), loading = _b[0], setLoading = _b[1];
  var sendSignInLinkToEmail$1 = (0, import_react.useCallback)(function(email, actionCodeSettings) {
    return __awaiter(void 0, void 0, void 0, function() {
      var err_1;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            setLoading(true);
            setError(void 0);
            _a2.label = 1;
          case 1:
            _a2.trys.push([1, 3, 4, 5]);
            return [4, sendSignInLinkToEmail(auth, email, actionCodeSettings)];
          case 2:
            _a2.sent();
            return [2, true];
          case 3:
            err_1 = _a2.sent();
            setError(err_1);
            return [2, false];
          case 4:
            setLoading(false);
            return [
              7
              /*endfinally*/
            ];
          case 5:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }, [auth]);
  return [sendSignInLinkToEmail$1, loading, error];
};
var useSignInWithEmailAndPassword = function(auth) {
  var _a = (0, import_react.useState)(), error = _a[0], setError = _a[1];
  var _b = (0, import_react.useState)(), loggedInUser = _b[0], setLoggedInUser = _b[1];
  var _c = (0, import_react.useState)(false), loading = _c[0], setLoading = _c[1];
  var signInWithEmailAndPassword$1 = (0, import_react.useCallback)(function(email, password) {
    return __awaiter(void 0, void 0, void 0, function() {
      var user, err_1;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            setLoading(true);
            setError(void 0);
            _a2.label = 1;
          case 1:
            _a2.trys.push([1, 3, 4, 5]);
            return [4, signInWithEmailAndPassword(auth, email, password)];
          case 2:
            user = _a2.sent();
            setLoggedInUser(user);
            return [2, user];
          case 3:
            err_1 = _a2.sent();
            setError(err_1);
            return [3, 5];
          case 4:
            setLoading(false);
            return [
              7
              /*endfinally*/
            ];
          case 5:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }, [auth]);
  return [signInWithEmailAndPassword$1, loggedInUser, loading, error];
};
var useSignInWithEmailLink = function(auth) {
  var _a = (0, import_react.useState)(), error = _a[0], setError = _a[1];
  var _b = (0, import_react.useState)(), loggedInUser = _b[0], setLoggedInUser = _b[1];
  var _c = (0, import_react.useState)(false), loading = _c[0], setLoading = _c[1];
  var signInWithEmailLink$1 = (0, import_react.useCallback)(function(email, emailLink) {
    return __awaiter(void 0, void 0, void 0, function() {
      var user, err_1;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            setLoading(true);
            setError(void 0);
            _a2.label = 1;
          case 1:
            _a2.trys.push([1, 3, 4, 5]);
            return [4, signInWithEmailLink(auth, email, emailLink)];
          case 2:
            user = _a2.sent();
            setLoggedInUser(user);
            return [2, user];
          case 3:
            err_1 = _a2.sent();
            setError(err_1);
            return [3, 5];
          case 4:
            setLoading(false);
            return [
              7
              /*endfinally*/
            ];
          case 5:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }, [auth]);
  return [signInWithEmailLink$1, loggedInUser, loading, error];
};
var useSignInWithApple = function(auth) {
  return useSignInWithOAuth(auth, "apple.com");
};
var useSignInWithFacebook = function(auth) {
  var createFacebookAuthProvider = (0, import_react.useCallback)(function(scopes, customOAuthParameters) {
    var provider = new FacebookAuthProvider();
    if (scopes) {
      scopes.forEach(function(scope) {
        return provider.addScope(scope);
      });
    }
    if (customOAuthParameters) {
      provider.setCustomParameters(customOAuthParameters);
    }
    return provider;
  }, []);
  return useSignInWithPopup(auth, createFacebookAuthProvider);
};
var useSignInWithGithub = function(auth) {
  var createGithubAuthProvider = (0, import_react.useCallback)(function(scopes, customOAuthParameters) {
    var provider = new GithubAuthProvider();
    if (scopes) {
      scopes.forEach(function(scope) {
        return provider.addScope(scope);
      });
    }
    if (customOAuthParameters) {
      provider.setCustomParameters(customOAuthParameters);
    }
    return provider;
  }, []);
  return useSignInWithPopup(auth, createGithubAuthProvider);
};
var useSignInWithGoogle = function(auth) {
  var createGoogleAuthProvider = (0, import_react.useCallback)(function(scopes, customOAuthParameters) {
    var provider = new GoogleAuthProvider();
    if (scopes) {
      scopes.forEach(function(scope) {
        return provider.addScope(scope);
      });
    }
    if (customOAuthParameters) {
      provider.setCustomParameters(customOAuthParameters);
    }
    return provider;
  }, []);
  return useSignInWithPopup(auth, createGoogleAuthProvider);
};
var useSignInWithMicrosoft = function(auth) {
  return useSignInWithOAuth(auth, "microsoft.com");
};
var useSignInWithTwitter = function(auth) {
  var createTwitterAuthProvider = (0, import_react.useCallback)(function(scopes, customOAuthParameters) {
    var provider = new TwitterAuthProvider();
    if (scopes) {
      scopes.forEach(function(scope) {
        return provider.addScope(scope);
      });
    }
    if (customOAuthParameters) {
      provider.setCustomParameters(customOAuthParameters);
    }
    return provider;
  }, []);
  return useSignInWithPopup(auth, createTwitterAuthProvider);
};
var useSignInWithYahoo = function(auth) {
  return useSignInWithOAuth(auth, "yahoo.com");
};
var useSignInWithOAuth = function(auth, providerId) {
  var createOAuthProvider = (0, import_react.useCallback)(function(scopes, customOAuthParameters) {
    var provider = new OAuthProvider(providerId);
    if (scopes) {
      scopes.forEach(function(scope) {
        return provider.addScope(scope);
      });
    }
    if (customOAuthParameters) {
      provider.setCustomParameters(customOAuthParameters);
    }
    return provider;
  }, [providerId]);
  return useSignInWithPopup(auth, createOAuthProvider);
};
var useSignInWithPopup = function(auth, createProvider) {
  var _a = (0, import_react.useState)(), error = _a[0], setError = _a[1];
  var _b = (0, import_react.useState)(), loggedInUser = _b[0], setLoggedInUser = _b[1];
  var _c = (0, import_react.useState)(false), loading = _c[0], setLoading = _c[1];
  var doSignInWithPopup = (0, import_react.useCallback)(function(scopes, customOAuthParameters) {
    return __awaiter(void 0, void 0, void 0, function() {
      var provider, user, err_1;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            setLoading(true);
            setError(void 0);
            _a2.label = 1;
          case 1:
            _a2.trys.push([1, 3, 4, 5]);
            provider = createProvider(scopes, customOAuthParameters);
            return [4, signInWithPopup(auth, provider)];
          case 2:
            user = _a2.sent();
            setLoggedInUser(user);
            return [2, user];
          case 3:
            err_1 = _a2.sent();
            setError(err_1);
            return [3, 5];
          case 4:
            setLoading(false);
            return [
              7
              /*endfinally*/
            ];
          case 5:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }, [auth, createProvider]);
  return [doSignInWithPopup, loggedInUser, loading, error];
};
var useSignOut = function(auth) {
  var _a = (0, import_react.useState)(), error = _a[0], setError = _a[1];
  var _b = (0, import_react.useState)(false), loading = _b[0], setLoading = _b[1];
  var signOut = (0, import_react.useCallback)(function() {
    return __awaiter(void 0, void 0, void 0, function() {
      var err_1;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            setLoading(true);
            setError(void 0);
            _a2.label = 1;
          case 1:
            _a2.trys.push([1, 3, 4, 5]);
            return [4, auth.signOut()];
          case 2:
            _a2.sent();
            return [2, true];
          case 3:
            err_1 = _a2.sent();
            setError(err_1);
            return [2, false];
          case 4:
            setLoading(false);
            return [
              7
              /*endfinally*/
            ];
          case 5:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }, [auth]);
  return [signOut, loading, error];
};
var useUpdateEmail = function(auth) {
  var _a = (0, import_react.useState)(), error = _a[0], setError = _a[1];
  var _b = (0, import_react.useState)(false), loading = _b[0], setLoading = _b[1];
  var updateEmail$1 = (0, import_react.useCallback)(function(email) {
    return __awaiter(void 0, void 0, void 0, function() {
      var err_1;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            setLoading(true);
            setError(void 0);
            _a2.label = 1;
          case 1:
            _a2.trys.push([1, 5, 6, 7]);
            if (!auth.currentUser) return [3, 3];
            return [4, updateEmail(auth.currentUser, email)];
          case 2:
            _a2.sent();
            return [2, true];
          case 3:
            throw new Error("No user is logged in");
          case 4:
            return [3, 7];
          case 5:
            err_1 = _a2.sent();
            setError(err_1);
            return [2, false];
          case 6:
            setLoading(false);
            return [
              7
              /*endfinally*/
            ];
          case 7:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }, [auth]);
  return [updateEmail$1, loading, error];
};
var useUpdatePassword = function(auth) {
  var _a = (0, import_react.useState)(), error = _a[0], setError = _a[1];
  var _b = (0, import_react.useState)(false), loading = _b[0], setLoading = _b[1];
  var updatePassword$1 = (0, import_react.useCallback)(function(password) {
    return __awaiter(void 0, void 0, void 0, function() {
      var err_2;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            setLoading(true);
            setError(void 0);
            _a2.label = 1;
          case 1:
            _a2.trys.push([1, 5, 6, 7]);
            if (!auth.currentUser) return [3, 3];
            return [4, updatePassword(auth.currentUser, password)];
          case 2:
            _a2.sent();
            return [2, true];
          case 3:
            throw new Error("No user is logged in");
          case 4:
            return [3, 7];
          case 5:
            err_2 = _a2.sent();
            setError(err_2);
            return [2, false];
          case 6:
            setLoading(false);
            return [
              7
              /*endfinally*/
            ];
          case 7:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }, [auth]);
  return [updatePassword$1, loading, error];
};
var useUpdateProfile = function(auth) {
  var _a = (0, import_react.useState)(), error = _a[0], setError = _a[1];
  var _b = (0, import_react.useState)(false), loading = _b[0], setLoading = _b[1];
  var updateProfile$1 = (0, import_react.useCallback)(function(profile) {
    return __awaiter(void 0, void 0, void 0, function() {
      var err_3;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            setLoading(true);
            setError(void 0);
            _a2.label = 1;
          case 1:
            _a2.trys.push([1, 5, 6, 7]);
            if (!auth.currentUser) return [3, 3];
            return [4, updateProfile(auth.currentUser, profile)];
          case 2:
            _a2.sent();
            return [2, true];
          case 3:
            throw new Error("No user is logged in");
          case 4:
            return [3, 7];
          case 5:
            err_3 = _a2.sent();
            setError(err_3);
            return [2, false];
          case 6:
            setLoading(false);
            return [
              7
              /*endfinally*/
            ];
          case 7:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }, [auth]);
  return [updateProfile$1, loading, error];
};
var useVerifyBeforeUpdateEmail = function(auth) {
  var _a = (0, import_react.useState)(), error = _a[0], setError = _a[1];
  var _b = (0, import_react.useState)(false), loading = _b[0], setLoading = _b[1];
  var verifyBeforeUpdateEmail$1 = (0, import_react.useCallback)(function(email, actionCodeSettings) {
    return __awaiter(void 0, void 0, void 0, function() {
      var err_4;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            setLoading(true);
            setError(void 0);
            _a2.label = 1;
          case 1:
            _a2.trys.push([1, 5, 6, 7]);
            if (!auth.currentUser) return [3, 3];
            return [4, verifyBeforeUpdateEmail(auth.currentUser, email, actionCodeSettings)];
          case 2:
            _a2.sent();
            return [2, true];
          case 3:
            throw new Error("No user is logged in");
          case 4:
            return [3, 7];
          case 5:
            err_4 = _a2.sent();
            setError(err_4);
            return [2, false];
          case 6:
            setLoading(false);
            return [
              7
              /*endfinally*/
            ];
          case 7:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }, [auth]);
  return [verifyBeforeUpdateEmail$1, loading, error];
};
var useIdToken = function(auth, options) {
  var _a = useLoadingValue(function() {
    return auth.currentUser;
  }), error = _a.error, loading = _a.loading, setError = _a.setError, setValue = _a.setValue, value = _a.value;
  (0, import_react.useEffect)(function() {
    var listener = onIdTokenChanged(auth, function(user) {
      return __awaiter(void 0, void 0, void 0, function() {
        var e_1;
        return __generator(this, function(_a2) {
          switch (_a2.label) {
            case 0:
              if (!(options === null || options === void 0 ? void 0 : options.onUserChanged)) return [3, 4];
              _a2.label = 1;
            case 1:
              _a2.trys.push([1, 3, , 4]);
              return [4, options.onUserChanged(user)];
            case 2:
              _a2.sent();
              return [3, 4];
            case 3:
              e_1 = _a2.sent();
              setError(e_1);
              return [3, 4];
            case 4:
              setValue(user);
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, setError);
    return function() {
      listener();
    };
  }, [auth]);
  return [value, loading, error];
};
export {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useDeleteUser,
  useIdToken,
  useSendEmailVerification,
  useSendPasswordResetEmail,
  useSendSignInLinkToEmail,
  useSignInWithApple,
  useSignInWithEmailAndPassword,
  useSignInWithEmailLink,
  useSignInWithFacebook,
  useSignInWithGithub,
  useSignInWithGoogle,
  useSignInWithMicrosoft,
  useSignInWithTwitter,
  useSignInWithYahoo,
  useSignOut,
  useUpdateEmail,
  useUpdatePassword,
  useUpdateProfile,
  useVerifyBeforeUpdateEmail
};
/*! Bundled license information:

react-firebase-hooks/auth/dist/index.esm.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)
*/
//# sourceMappingURL=react-firebase-hooks_auth.js.map
