class Assert
{
    public static AreEqual<T>(expected: T, actual: T, message: string = ""): void
    {
        if (expected !== actual)
        {
            throw "Assert.AreEqual failed. "
                + "Expected: <" + expected + ">. "
                + "Actual: <" + actual + ">. "
                + message;
        }
    }

    public static AreNotEqual<T>(notExpected: T, actual: T, message: string = ""): void
    {
        if (notExpected === actual)
        {
            throw "Assert.AreNotEqual failed. "
                + "Expected any value except: <" + notExpected + ">. "
                + "Actual: <" + actual + ">. "
                + message;
        }
    }

    public static AreNotSame<T>(notExpected: T, actual: T, message: string = ""): void
    {
        if (typeof (notExpected) !== "object"
            || typeof (actual) !== "object")
        {
            throw "Assert.AreSame failed. Do not pass value types to AreSame(). Consider using AreEqual()."
        }

        if (notExpected === actual)
        {
            throw "Assert.AreNotSame failed. " + message;
        }
    }

    public static AreSequenceEqual<T>(expected: T[], actual: T[], equals?: (x, y) => boolean, message: string = ""): void
    {
        if (expected === null || actual === null)
        {
            throw "Assert.AreSequenceEqual failed. Do not pass null values to arrays. " + message;
        }

        if (expected === actual)
        {
            return;
        }

        if (expected.length !== actual.length)
        {
            throw "Assert.AreSequenceEqual failed. Length mismatch. "
                + "Expected: <" + expected.length + ">. "
                + "Actual: <" + actual.length + ">. "
                + message;
        }

        if (!equals)
            equals = (x, y) => x == y;

        for (var i = 0, n = expected.length; i < n; i++)
        {
            if (!equals(expected[i], actual[i]))
            {
                throw "Assert.AreSequenceEqual failed. "
                    + "Expected: <" + expected[i] + ">. Actual: <" + actual[i] + ">."
                    + message;
            }
        }
    }

    public static Fail(message: string = ""): void
    {
        throw "Assert.Fail failed. " + message;
    }

    // TODO: Implementation
    public static Inconclusive(message: string = ""): void
    {
        throw "NotImplementedException";
    }

    public static IsFalse(actual: boolean, message: string = ""): void
    {
        if (actual !== false)
        {
            throw "Assert.IsFalse failed. " + message;
        }
    }

    public static IsInstanceOfType(actual: any, expectedType: Function, message: string = ""): void
    {
        if (!(actual instanceof expectedType))
        {
            var expectedTypeName = /^function\s*([^(]*)/i.exec(expectedType + "")[1].toLocaleLowerCase();
            var actualTypeName = /^function\s*([^(]*)/i.exec(actual.constructor + "")[1].toLocaleLowerCase();

            throw "Assert.IsInstanceOfType failed. "
                + "Expected type: <" + expectedTypeName + ">. "
                + "Actual type: <" + actualTypeName + ">. "
                + message;
        }
    }

    public static IsNotInstanceOfType(actual: any, wrongType: Function, message: string = ""): void
    {
        if (actual instanceof wrongType)
        {
            var wrongTypeName = /^function\s*([^(]*)/i.exec(wrongType + "")[1].toLocaleLowerCase();
            var actualTypeName = /^function\s*([^(]*)/i.exec(actual.constructor + "")[1].toLocaleLowerCase();
            
            throw "Assert.IsNotInstanceOfType failed. "
                + "Expected any type except: <" + wrongTypeName + ">. "
                + "Actual type: <" + actualTypeName + ">. "
                + message;
        }
    }

    public static IsNotNull(actual: boolean, message: string = ""): void
    {
        if (actual === null)
        {
            throw "Assert.IsNotNull failed. " + message;
        }
    }

    public static IsNull(actual: boolean, message: string = ""): void
    {
        if (actual !== null)
        {
            throw "Assert.IsNull failed. " + message;
        }
    }

    public static IsTrue(actual: boolean, message: string = ""): void
    {
        if (actual !== true)
        {
            throw "Assert.IsTrue failed. " + message;
        }
    }

    public static Throws(fn: () => void, message: string = ""): void
    {
        var result = false;

        try
        {
            fn();
        }
        catch (ex)
        {
            result = true;
        }

        if (!result)
            throw "Assert.Throws failed. " + message;
    }
}