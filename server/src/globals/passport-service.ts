//* package imports
import passport from "passport";
import { Types } from "mongoose";
import { Strategy as LocalStrategy } from "passport-local";

//* file imports
import { UserDocument, UserModel } from "@/models/user.model";
import { SessionUser } from "@/types/session-user";
import { ExceptionType, throwHttpException } from "@/utils/http-exception";
import { verifyPassword } from "@/utils/password";
import { DistrictModel } from "@/models/location-models/district.model";

passport.use(
    new LocalStrategy(
        { usernameField: "username" },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ username })
                    .populate("role_id", "role_name")
                    .exec();

                if (!user) throwHttpException(ExceptionType.NotFound, "User not found");

                const isValid = await verifyPassword(password, user.password);

                if (!isValid)
                    return done(null, false, { message: "Invalid credentials" });

                const typedUser = user as UserDocument;
                let district: any = null;
                if (typedUser.district_code || typedUser.location?.district_code) {
                    district = await DistrictModel.findOne({
                        district_code:
                            typedUser.district_code || typedUser.location?.district_code,
                    }).lean();
                }

                const sessionUser: SessionUser = {
                    user_id: (typedUser._id as Types.ObjectId).toString(),
                    username: typedUser.username,
                    email: typedUser.email,
                    role_name: (typedUser.role_id as any)?.role_name || null,

                    district_code:
                        typedUser.district_code || typedUser.location?.district_code || null,
                    district_name:
                        typedUser.district_name ||
                        typedUser.location?.district_name ||
                        district?.district_name ||
                        null,

                    state_code: "03",
                    state_name: "Punjab",
                    district: district
                        ? {
                            district_id: district._id.toString(),
                            district_code: district.district_code,
                            district_name: district.district_name,
                            state_code: district.state_code,
                            state_name: district.state_name,
                        }
                        : null,
                };

                return done(null, sessionUser);
            } catch (error) {
                return done(error);
            }
        }
    )
);
//* Serialize user into session
passport.serializeUser((sessionUser: SessionUser, done) => {
    done(null, sessionUser);
});

//* Deserialize user from session
passport.deserializeUser((sessionUser: SessionUser, done) => {
    done(null, sessionUser as SessionUser);
});

export default passport;