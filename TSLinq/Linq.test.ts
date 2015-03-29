/// <reference path="UnitTest.ts" />
/// <reference path="Linq.ts" />

declare var $: any;

class LinqTest
{
    Aggregate(): void
    {
        Assert.AreEqual(106
            , [3, 100, 1, 2].AsLinq<number>().Aggregate((a, b) => a + b)
        );
    }

    All(): void
    {
        Assert.IsTrue([3, 100, 1, 2].AsLinq().All(i => i > 0));
    }

    Any(): void
    {
        Assert.IsTrue([3, 100, 1, 2].AsLinq().Any(i => i == 1));
    }

    Average(): void
    {
        Assert.AreEqual((3 + 100 + 1 + 2) / 4
            , [3, 100, 1, 2].AsLinq().Average()
        );

        Assert.AreEqual((3 + 100 + 1 + 2) / 4
            , [{ Value: 3 }, { Value: 100 }, { Value: 1 }, { Value: 2 }]
                .AsLinq<any>()
                .Average(o => o.Value)
        );
    }

    Concat(): void
    {
        var expected = [1, 2, 3, 4];
        var actual = [1, 2].AsLinq().Concat([3, 4]).ToArray();

        Assert.AreEqual(expected.length, actual.length);
        Assert.AreEqual(expected[0], actual[0]);
        Assert.AreEqual(expected[1], actual[1]);
        Assert.AreEqual(expected[2], actual[2]);
        Assert.AreEqual(expected[3], actual[3]);
    }

    Contains(): void
    {
        Assert.IsTrue([1, 2, 3].AsLinq().Contains(2));
        Assert.IsFalse([1, 2, 3].AsLinq().Contains(20));

        var comparer = {
            Equals: function (x, y) { return x == y; },
            GetHashCode: function (obj) { return obj; }
        };

        Assert.IsTrue([1, 2, 3].AsLinq().Contains(2, comparer));
        Assert.IsFalse([1, 2, 3].AsLinq().Contains(20, comparer));
    }

    Count(): void
    {
        Assert.AreEqual(4, [1, 2, 3, 5].AsLinq().Count());

        Assert.AreEqual(2, [1, 2, 3, 5].AsLinq().Count(o => o <= 2));
    }

    Distinct(): void
    {
        var expected = [1, 2];
        var actual = [1, 1, 2, 2].AsLinq().Distinct().ToArray();
        
        Assert.AreEqual(expected.length, actual.length);
        Assert.AreEqual(expected[0], actual[0]);
        Assert.AreEqual(expected[1], actual[1]);

        var comparer = {
            Equals: (x, y) => { return x == y; },
            GetHashCode: (obj) => { return obj; }
        };

        actual = [1, 1, 2, 2].AsLinq().Distinct(comparer).ToArray();

        Assert.AreEqual(expected.length, actual.length);
        Assert.AreEqual(expected[0], actual[0]);
        Assert.AreEqual(expected[1], actual[1]);
    }

    DistinctBy(): void
    {
        var expected = [{ Value: 1 }, { Value: 2 }];
        var actual = [{ Value: 1 }, { Value: 2 }, { Value: 1 }].AsLinq<any>()
            .DistinctBy(o => o.Value).ToArray();
        
        Assert.AreEqual(expected.length, actual.length);
        Assert.AreEqual(expected[0].Value, actual[0].Value);
        Assert.AreEqual(expected[1].Value, actual[1].Value);

        var comparer = {
            Equals: (x, y) => { return x.Value == y.Value; },
            GetHashCode: (obj) => { return obj.Value; }
        };

        actual = [{ Value: 1 }, { Value: 2 }, { Value: 1 }].AsLinq()
            .DistinctBy(o => o, comparer).ToArray();

        Assert.AreEqual(expected.length, actual.length);
        Assert.AreEqual(expected[0].Value, actual[0].Value);
        Assert.AreEqual(expected[1].Value, actual[1].Value);
    }

    ElementAt(): void
    {
        Assert.AreEqual(5, [1, 2, 5, 4].AsLinq().ElementAt(2));
        Assert.Throws(() => [1].AsLinq().ElementAt(-1));
        Assert.Throws(() => [1].AsLinq().ElementAt(1));
    }

    ElementAtOrDefault(): void
    {
        Assert.AreEqual(10, [1, 2, 3].AsLinq().ElementAtOrDefault(100, 10));
        Assert.AreEqual(2, [1, 2].AsLinq().ElementAtOrDefault(1, 10));
    }

    Except(): void
    {
        var expected: any = [1, 2];
        var actual: any = [1, 2, 3, 4].AsLinq().Except([3, 4]).ToArray();

        Assert.AreEqual(expected.length, actual.length, "without comparer");
        Assert.AreEqual(expected[0], actual[0]);
        Assert.AreEqual(expected[1], actual[1]);

        var comparer = {
            Equals: (x, y) => { return x.Value == y.Value; },
            GetHashCode: (obj) => { return obj.Value; }
        };

        expected = [{ Value: 1 }, { Value: 2 }];
        actual = [{ Value: 1 }, { Value: 2 }, { Value: 3 }, { Value: 4 }]
            .AsLinq().Except([{ Value: 3 }, { Value: 4 }], comparer).ToArray();

        Assert.AreEqual(expected.length, actual.length, "with comparer");
        Assert.AreEqual(expected[0].Value, actual[0].Value);
        Assert.AreEqual(expected[1].Value, actual[1].Value);
    }

    First(): void
    {
        Assert.AreEqual(1, [1, 2, 3].AsLinq().First());
        Assert.Throws(() => [].AsLinq().First());

        Assert.AreEqual(2, [1, 2, 3].AsLinq().First(o => o == 2));
        Assert.Throws(() => [1, 2].AsLinq().First(o => o == 3));
    }

    FirstOrDefault(): void
    {
        Assert.AreEqual(1, [1, 2, 3].AsLinq().FirstOrDefault());
        Assert.AreEqual(10, [].AsLinq().FirstOrDefault(null, 10));

        Assert.AreEqual(3, [1, 2, 3].AsLinq().FirstOrDefault(o => o == 3));
        Assert.AreEqual(10, [1, 2, 3].AsLinq().FirstOrDefault(o => o == 11, 10));
    }

    ForEach(): void
    {
        var actual = 1;
        [1, 2, 3].AsLinq<number>().ForEach(i => actual *= i);

        Assert.AreEqual(6, actual);

        actual = 1;
        [1, 2, 10, 110, 1110].AsLinq<number>().ForEach(i => { if (i > 2) return false; actual *= i; });

        Assert.AreEqual(2, actual);
    }

    GroupBy(): void
    {
        var actual = [{ Key: 1, Value: 2 }, { Key: 1, Value: 3 }]
            .AsLinq<any>()
            .GroupBy(o => o.Key);

        Assert.AreEqual(1, actual.Count());
        Assert.AreEqual(2, actual.ElementAt(0).Elements.length);
    }

    IndexOf(): void
    {
        Assert.AreEqual(2, [0, 2, 1].AsLinq().IndexOf(1));
        Assert.AreEqual(-1, [0, 2, 1].AsLinq().IndexOf(100));
        Assert.AreEqual(-1, [].AsLinq().IndexOf(0));
        Assert.AreEqual(-1, [].AsLinq().IndexOf(undefined));
        Assert.AreEqual(-1, [].AsLinq().IndexOf(null));
    }

    Intersect(): void
    {
        Assert.AreSequenceEqual(
            [1, 2, 3]
            , [1, 2, 3, 4, 5].AsLinq().Intersect([1, 2, 3]).ToArray()
            , (x, y) => x == y
            );
        
        var comparer = {
            Equals: (x, y) => { return x.Value == y.Value; },
            GetHashCode: (obj) => { return obj.Value; }
        };

        Assert.AreSequenceEqual(
            [{ Value: 1 }, { Value: 3 }]
            , [{ Value: 1 }, { Value: 3 }, { Value: 2 }].AsLinq()
                .Intersect([{ Value: 1 }, { Value: 3 }], comparer).ToArray()
            , (x, y) => x.Value == y.Value
        );
    }

    Join(): void
    {
        var joinedSimple = [1].AsLinq<number>().Join([1], o => o, i => i, (o, i) => { return { Outer: o, Inner: i } });
        Assert.AreEqual(1, joinedSimple.Count(), "Element count is wrong.");
        Assert.AreEqual(1, (<any>joinedSimple.First()).Outer);
        Assert.AreEqual(1, (<any>joinedSimple.First()).Inner);

        var joined = [{ ID: 1, Value: 1 }].AsLinq<any>()
            .Join([{ ID: 1, Value: 2 }]
                , o => o
                , i => i
                , (o, i) => { return { Outer: o.Value, Inner: i.Value } }
                , {
                    Equals: (x, y) => x.ID == y.ID,
                    GetHashCode: (obj) => obj.ID
                }
            );
        Assert.AreEqual(1, joined.Count(), "Element count with comparer is wrong.");
        Assert.AreEqual(1, joined.First().Outer);
        Assert.AreEqual(2, joined.First().Inner);
    }

    Last(): void
    {
        Assert.AreEqual(1, [3, 4, 1].AsLinq().Last());
        Assert.AreEqual(4, [3, 4, 1].AsLinq().Last(o => o > 1));
        Assert.Throws(() => [].AsLinq().Last());
        Assert.Throws(() => [3, 4, 1].AsLinq().Last(o => o > 100));
    }

    LastOrDefault(): void
    {
        Assert.AreEqual(1, [3, 4, 1].AsLinq().Last());
        Assert.AreEqual(4, [3, 4, 1].AsLinq().Last(o => o > 1));
        Assert.AreEqual(100, [].AsLinq().LastOrDefault(null, 100));
        Assert.AreEqual(100, [3, 4, 1].AsLinq().LastOrDefault(o => o > 100, 100));
    }

    Max(): void
    {
        Assert.AreEqual(10, [5, 7, 2, 10].AsLinq().Max());
        Assert.AreEqual(10, [{ Value: 10 }, { Value: 7 }].AsLinq<any>().Max(o => o.Value));
        Assert.Throws(() => [].AsLinq().Max());
    }

    Min(): void
    {
        Assert.AreEqual(2, [5, 7, 2, 10].AsLinq().Min());
        Assert.AreEqual(7, [{ Value: 10 }, { Value: 7 }].AsLinq<any>().Min(o => o.Value));
        Assert.Throws(() => [].AsLinq().Min());
    }

    OrderBy(): void
    {
        Assert.AreSequenceEqual([1, 2, 3], [3, 1, 2].AsLinq().OrderBy(o => o).ToArray(), null, "Failed to order");

        Assert.AreSequenceEqual([{ Value: 1 }, { Value: 2 }],
            [{ Value: 2 }, { Value: 1 }].AsLinq<any>().OrderBy(o => o.Value).ToArray()
            , (a, b) => a.Value == b.Value, "Failed to order objects");

        Assert.AreSequenceEqual([{ Value: 2 }, { Value: 1 }],
            [{ Value: 1 }, { Value: 2 }].AsLinq<any>()
                .OrderBy(o => o.Value, (a, b) => b - a).ToArray()
            , (a, b) => a.Value == b.Value, "Failed to order object with comparer");

        Assert.AreSequenceEqual([], [].AsLinq().OrderBy(o => o).ToArray(), null, "Failed to order empty arrays");

        Assert.AreSequenceEqual(["a", "b", "c"], ["c", "a", "b"].AsLinq().OrderBy(o => o).ToArray());

        Assert.AreEqual("a"
            , [{ Title: "b", Message: "b" }, { Title: "c", Message: "c" }, { Title: "a", Message: "a" }].AsLinq<any>().OrderBy(o => o.Title).First().Title);
    }

    OrderByDescending(): void
    {
        Assert.AreSequenceEqual([3, 2, 1], [3, 1, 2].AsLinq().OrderByDescending(o => o).ToArray(), null, "Failed to order");

        Assert.AreSequenceEqual([{ Value: 2 }, { Value: 1 }],
            [{ Value: 1 }, { Value: 2 }].AsLinq<any>().OrderByDescending(o => o.Value).ToArray()
            , (a, b) => a.Value == b.Value, "Failed to order objects");

        Assert.AreSequenceEqual([{ Value: 1 }, { Value: 2 }],
            [{ Value: 2 }, { Value: 1 }].AsLinq<any>()
                .OrderByDescending(o => o.Value, (a, b) => b - a).ToArray()
            , (a, b) => a.Value == b.Value, "Failed to order object with comparer");

        Assert.AreSequenceEqual([], [].AsLinq().OrderByDescending(o => o).ToArray(), null, "Failed to order empty arrays");
    }

    Reverse(): void
    {
        Assert.AreSequenceEqual([], [].AsLinq().Reverse().ToArray(), null, "Failed to reverse empty arrays");
        Assert.AreSequenceEqual([2, 1], [1, 2].AsLinq().Reverse().ToArray(), null, "Failed to reverse even arrays");
        Assert.AreSequenceEqual([3, 2, 1], [1, 2, 3].AsLinq().Reverse().ToArray(), null, "Failed to reverse odd arrays");
        Assert.AreSequenceEqual([{ Value: 1 }, { Value: 2 }]
            , [{ Value: 2 }, { Value: 1 }].AsLinq().Reverse().ToArray()
            , (a, b) => a.Value == b.Value, "Failed to reverse object arrays");

    }

    Select(): void
    {
        Assert.AreSequenceEqual(
            [1, 2, 3]
            , [{ Value: 1 }, { Value: 2 }, { Value: 3 }]
                .AsLinq<any>()
                .Select(o => o.Value).ToArray()
        );
    }

    SelectMany(): void
    {
        Assert.AreSequenceEqual([], [].AsLinq<any>().SelectMany(o => o).ToArray());

        Assert.AreSequenceEqual([1, 2, 3, 4, 5, 6]
            , [[1, 2, 3], [4, 5, 6]].AsLinq<any>().SelectMany(o => o).ToArray());

        Assert.AreSequenceEqual([1, 2, 3, 4]
            , [{ Values: [1, 2] }, { Values: [3, 4] }].AsLinq<any>()
                .SelectMany(o => o.Values).ToArray());
        
        Assert.AreSequenceEqual([10, 20, 30, 40]
            , [{ Values: [1, 2] }, { Values: [3, 4] }].AsLinq<any>()
                .SelectMany(o => o.Values, o => o * 10).ToArray());
    }

    SequenceEqual(): void
    {
        Assert.Throws(() => [].AsLinq().SequenceEqual(null));
        
        Assert.IsTrue([1, 2].AsLinq().SequenceEqual([1, 2]));
        Assert.IsFalse([1, 2].AsLinq().SequenceEqual([1, 2, 3]));
        Assert.IsFalse([1, 2].AsLinq().SequenceEqual([2, 1]));
    }

    Single(): void
    {
        Assert.Throws(() => [1, 2].AsLinq().Single());
        Assert.Throws(() => [1, 2, 3, 4].AsLinq().Single(o => o < 3));

        Assert.AreEqual(1, [1].AsLinq().Single());
        Assert.AreEqual(2, [1, 2, -1].AsLinq().Single(o => o > 1));
    }

    SingleOrDefault(): void
    {
        Assert.AreEqual(10, [1, 2].AsLinq().SingleOrDefault(null, 10));
        Assert.AreEqual(10, [1, 2, 3, 4].AsLinq().SingleOrDefault(o => o < 3, 10));


        Assert.AreEqual(1, [1].AsLinq().SingleOrDefault());
        Assert.AreEqual(2, [1, 2, -1].AsLinq().SingleOrDefault(o => o > 1));
    }

    Skip(): void
    {
        Assert.AreSequenceEqual([], [1, 2, 3, 4].AsLinq().Skip(100).ToArray());
        Assert.AreSequenceEqual([3, 4], [1, 2, 3, 4].AsLinq().Skip(2).ToArray());
        Assert.AreSequenceEqual([1, 2, 3, 4], [1, 2, 3, 4].AsLinq().Skip(0).ToArray());
    }

    SkipWhile(): void
    {
        Assert.AreSequenceEqual([], [1, 2, 3, 4].AsLinq().SkipWhile(o => o <= 100).ToArray());
        Assert.AreSequenceEqual([3, 4], [1, 2, 3, 4].AsLinq().SkipWhile(o => o <= 2).ToArray());
    }

    Sum(): void
    {
        Assert.AreEqual(0, [].AsLinq().Sum());
        Assert.AreEqual(10, [2, 2, 1, 5].AsLinq().Sum());
        Assert.AreEqual(11, [{ Value: 2 }, { Value: 4 }, { Value: 5 }].AsLinq<any>().Sum(o => o.Value));
    }

    Take(): void
    {
        Assert.AreSequenceEqual([], [1, 2, 3, 4].AsLinq().Take(0).ToArray());
        Assert.AreSequenceEqual([1, 2], [1, 2, 3, 4].AsLinq().Take(2).ToArray());
        Assert.AreSequenceEqual([1, 2, 3, 4], [1, 2, 3, 4].AsLinq().Take(10).ToArray());
    }

    TakeWhile(): void
    {
        Assert.AreSequenceEqual([], [1, 2, 3, 4].AsLinq().TakeWhile(o => o < 1).ToArray());
        Assert.AreSequenceEqual([1, 2], [1, 2, 3, 4].AsLinq().TakeWhile(o => o <= 2).ToArray());
        Assert.AreSequenceEqual([1, 2, 3, 4], [1, 2, 3, 4].AsLinq().TakeWhile(o => o < 100).ToArray());
    }

    Union(): void
    {
        Assert.AreSequenceEqual([], [].AsLinq().Union([]).ToArray());
        Assert.AreSequenceEqual([1, 2, 3], [1, 2].AsLinq().Union([2, 3]).ToArray());
        Assert.AreSequenceEqual([1, 3, 2], [1, 3].AsLinq().Union([2, 3]).ToArray());
    }

    Where(): void
    {
        Assert.AreSequenceEqual([], [1, 2].AsLinq().Where(o => o > 100).ToArray());
        Assert.AreSequenceEqual([2], [1, 2].AsLinq().Where(o => o > 1).ToArray());
    }

    Zip(): void
    {
        Assert.AreSequenceEqual(["1 one"], [1].AsLinq().Zip(["one", "two"], (o, i) => o + " " + i).ToArray());
        Assert.AreSequenceEqual(["1 one", "2 two"], [1, 2].AsLinq().Zip(["one", "two"], (o, i) => o + " " + i).ToArray());
        Assert.AreSequenceEqual(["1 one", "2 two"], [1, 2, 3].AsLinq().Zip(["one", "two"], (o, i) => o + " " + i).ToArray());
    }
}

(function ()
{
    /// <tstest_reference path="jquery.js" />
    var TestBase = {
        RegisterTestMethod: function (a, b, c=null) { }
    };

    TestBase.RegisterTestMethod(LinqTest.prototype.Aggregate, "Aggregate");
    TestBase.RegisterTestMethod(LinqTest.prototype.All, "All");
    TestBase.RegisterTestMethod(LinqTest.prototype.Any, "Any");
    TestBase.RegisterTestMethod(LinqTest.prototype.Average, "Average");
    TestBase.RegisterTestMethod(LinqTest.prototype.Concat, "Concat");
    TestBase.RegisterTestMethod(LinqTest.prototype.Contains, "Contains");
    TestBase.RegisterTestMethod(LinqTest.prototype.Count, "Count");
    TestBase.RegisterTestMethod(LinqTest.prototype.Distinct, "Distinct");
    TestBase.RegisterTestMethod(LinqTest.prototype.DistinctBy, "DistinctBy");
    TestBase.RegisterTestMethod(LinqTest.prototype.ElementAt, "ElementAt");
    TestBase.RegisterTestMethod(LinqTest.prototype.ElementAtOrDefault, "ElementAtOrDefault");
    TestBase.RegisterTestMethod(LinqTest.prototype.Except, "Except");
    TestBase.RegisterTestMethod(LinqTest.prototype.First, "First");
    TestBase.RegisterTestMethod(LinqTest.prototype.FirstOrDefault, "FirstOrDefault");
    TestBase.RegisterTestMethod(LinqTest.prototype.ForEach, "ForEach");
    TestBase.RegisterTestMethod(LinqTest.prototype.GroupBy, "GroupBy");
    TestBase.RegisterTestMethod(LinqTest.prototype.IndexOf, "IndexOf");
    TestBase.RegisterTestMethod(LinqTest.prototype.Intersect, "Intersect");
    TestBase.RegisterTestMethod(LinqTest.prototype.Join, "Join");
    TestBase.RegisterTestMethod(LinqTest.prototype.Last, "Last");
    TestBase.RegisterTestMethod(LinqTest.prototype.LastOrDefault, "LastOrDefault");
    TestBase.RegisterTestMethod(LinqTest.prototype.Max, "Max");
    TestBase.RegisterTestMethod(LinqTest.prototype.Min, "Min");
    TestBase.RegisterTestMethod(LinqTest.prototype.OrderBy, "OrderBy");
    TestBase.RegisterTestMethod(LinqTest.prototype.OrderByDescending, "OrderByDescending");
    TestBase.RegisterTestMethod(LinqTest.prototype.Reverse, "Reverse");
    TestBase.RegisterTestMethod(LinqTest.prototype.Select, "Select");
    TestBase.RegisterTestMethod(LinqTest.prototype.SelectMany, "SelectMany");
    TestBase.RegisterTestMethod(LinqTest.prototype.SequenceEqual, "SequenceEqual");
    TestBase.RegisterTestMethod(LinqTest.prototype.Single, "Single");
    TestBase.RegisterTestMethod(LinqTest.prototype.SingleOrDefault, "SingleOrDefault");
    TestBase.RegisterTestMethod(LinqTest.prototype.Skip, "Skip");
    TestBase.RegisterTestMethod(LinqTest.prototype.SkipWhile, "SkipWhile");
    TestBase.RegisterTestMethod(LinqTest.prototype.Sum, "Sum");
    TestBase.RegisterTestMethod(LinqTest.prototype.Take, "Take");
    TestBase.RegisterTestMethod(LinqTest.prototype.TakeWhile, "TakeWhile");
    TestBase.RegisterTestMethod(LinqTest.prototype.Union, "Union");
    TestBase.RegisterTestMethod(LinqTest.prototype.Where, "Where");
    TestBase.RegisterTestMethod(LinqTest.prototype.Zip, "Zip");
});